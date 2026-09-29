import { supabase, isSupabaseConfigured } from './supabase';
import { Subscriber, Recipe, BlogArticle, Newsletter, YouTubeVideo, AdminUser, SiteSettings, ContactMessage, AnalyticsEvent } from '../types';
import { INITIAL_SUBSCRIBERS, INITIAL_NEWSLETTERS, INITIAL_ADMIN_USERS, DEFAULT_SITE_SETTINGS } from '../data/adminData';
import { RECIPES, BLOG_ARTICLES, YOUTUBE_VIDEOS } from '../data/recipesData';
import { extractYoutubeId, normalizeRecipe } from './youtube';

export async function testSupabaseConnection(): Promise<{ success: boolean; message: string; rawError?: any }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, message: 'Supabase client is not configured (missing URL or API Key).' };
  }
  try {
    const { data, error } = await supabase.from('recipes').select('id').limit(1);
    if (error) {
      if (error.code === 'PGRST301' || error.message?.includes('JWT') || error.message?.includes('apikey') || error.message?.includes('API key')) {
        return {
          success: false,
          rawError: error,
          message: `Invalid API Key or Auth Header error: ${error.message} (Code: ${error.code}). Note: Supabase Anon/Publishable Key must start with 'ey...' (JWT key format).`,
        };
      }
      if (error.code === '42501' || error.message?.includes('row-level security') || error.message?.includes('permission denied')) {
        return {
          success: false,
          rawError: error,
          message: `Row-Level Security (RLS) Permission Denied: ${error.message}. Please disable RLS or add public access policies in Supabase SQL Editor.`,
        };
      }
      return { success: false, rawError: error, message: `Supabase query returned error (${error.code}): ${error.message}` };
    }
    return { success: true, message: `Connected to Supabase successfully! Query returned ${data?.length ?? 0} sample row(s).` };
  } catch (err: any) {
    return { success: false, rawError: err, message: `Exception while connecting: ${err?.message || String(err)}` };
  }
}

export async function syncSubscriberToSupabase(subscriber: Subscriber) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('subscribers').upsert(
      {
        id: subscriber.id,
        email: subscriber.email,
        name: subscriber.name || null,
        subscribed_at: subscriber.subscribedAt,
        status: subscriber.status,
        source: subscriber.source || 'Website',
      },
      { onConflict: 'email' }
    );
    if (error) {
      console.warn('Supabase subscribers sync warning:', error.message);
    }
  } catch (err) {
    console.warn('Failed to sync subscriber to Supabase:', err);
  }
}

export async function fetchSubscribersFromSupabase(): Promise<Subscriber[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.from('subscribers').select('*');
    if (error || !data || data.length === 0) {
      // Auto-seed initial subscribers to Supabase if table is empty
      for (const sub of INITIAL_SUBSCRIBERS) {
        await syncSubscriberToSupabase(sub);
      }
      return INITIAL_SUBSCRIBERS;
    }
    return data.map((item) => ({
      id: item.id || String(item.email),
      email: item.email,
      name: item.name || undefined,
      subscribedAt: item.subscribed_at || new Date().toISOString().split('T')[0],
      status: item.status || 'active',
      source: item.source || 'Supabase',
    }));
  } catch {
    return null;
  }
}

export async function syncNewsletterToSupabase(newsletter: Newsletter) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('newsletters').upsert(
      {
        id: newsletter.id,
        subject: newsletter.subject,
        preview_text: newsletter.previewText,
        content: newsletter.content,
        audience: newsletter.audience,
        sent_at: newsletter.sentAt || null,
        recipient_count: newsletter.recipientCount,
        open_rate: newsletter.openRate || null,
        click_rate: newsletter.clickRate || null,
        status: newsletter.status,
        featured_recipe_id: newsletter.featuredRecipeId || null,
      },
      { onConflict: 'id' }
    );
    if (error) {
      console.warn('Supabase newsletters sync warning:', error.message);
    }
  } catch (err) {
    console.warn('Failed to sync newsletter to Supabase:', err);
  }
}

export async function fetchNewslettersFromSupabase(): Promise<Newsletter[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.from('newsletters').select('*');
    if (error || !data || data.length === 0) {
      // Auto-seed initial newsletters to Supabase if table is empty
      for (const news of INITIAL_NEWSLETTERS) {
        await syncNewsletterToSupabase(news);
      }
      return INITIAL_NEWSLETTERS;
    }
    return data.map((item) => ({
      id: item.id,
      subject: item.subject,
      previewText: item.preview_text || item.subject,
      content: item.content,
      audience: item.audience || 'All Active Subscribers',
      sentAt: item.sent_at || undefined,
      recipientCount: item.recipient_count || 0,
      openRate: item.open_rate || undefined,
      clickRate: item.click_rate || undefined,
      status: item.status || 'draft',
      featuredRecipeId: item.featured_recipe_id || undefined,
    }));
  } catch {
    return null;
  }
}

export async function syncRecipeToSupabase(recipe: Recipe) {
  if (!isSupabaseConfigured || !supabase) return;
  const videoId = extractYoutubeId(
    recipe.youtubeVideoId,
    recipe.youtubeUrl,
    (recipe as any).youtube_video_id,
    (recipe as any).youtube_url
  );
  try {
    const { error } = await supabase.from('recipes').upsert(
      {
        id: recipe.id,
        title: recipe.title,
        slug: recipe.slug,
        category: recipe.category,
        description: recipe.description,
        prep_time: recipe.prepTime,
        cook_time: recipe.cookTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        image: recipe.image,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        youtube_video_id: videoId || recipe.youtubeVideoId || recipe.youtubeUrl || null,
        archived: recipe.archived || false,
        draft: recipe.draft || false,
        featured: recipe.featured || false,
      },
      { onConflict: 'id' }
    );
    if (error) console.warn('Supabase recipes sync warning:', error.message);
  } catch (err) {
    console.warn('Failed to sync recipe to Supabase:', err);
  }
}

export async function fetchRecipesFromSupabase(): Promise<Recipe[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.from('recipes').select('*');
    if (error || !data || data.length === 0) {
      // Auto-seed initial recipes to Supabase if table is empty
      for (const rec of RECIPES) {
        await syncRecipeToSupabase(rec);
      }
      return RECIPES;
    }
    return data.map((item) => {
      const derivedId =
        extractYoutubeId(
          item.youtube_video_id,
          item.youtube_url,
          item.video_id,
          item.video_url,
          item.videoId,
          item.youtubeVideoId,
          item.youtubeUrl
        ) || undefined;

      const rawUrl =
        (item.youtube_url && String(item.youtube_url).startsWith('http') ? item.youtube_url : undefined) ||
        (item.video_url && String(item.video_url).startsWith('http') ? item.video_url : undefined) ||
        (item.youtube_video_id && String(item.youtube_video_id).startsWith('http') ? item.youtube_video_id : undefined) ||
        (item.video_id && String(item.video_id).startsWith('http') ? item.video_id : undefined);

      const derivedUrl =
        rawUrl || (derivedId ? `https://www.youtube.com/watch?v=${derivedId}` : undefined);

      return {
        id: item.id,
        title: item.title,
        slug: item.slug || item.id,
        category: item.category,
        image: item.image,
        prepTime: item.prep_time || '15 mins',
        cookTime: item.cook_time || '30 mins',
        totalTime: '45 mins',
        servings: item.servings || 4,
        rating: 4.9,
        reviewCount: 24,
        description: item.description || '',
        featured: item.featured || false,
        youtubeUrl: derivedUrl,
        youtubeVideoId: derivedId,
        difficulty: item.difficulty || 'Easy',
        ingredients: item.ingredients || [],
        instructions: item.instructions || [],
        tips: item.tips || [],
        archived: item.archived || false,
        draft: item.draft || false,
      };
    });
  } catch {
    return null;
  }
}

export async function syncArticleToSupabase(article: BlogArticle) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('blog_articles').upsert(
      {
        id: article.id,
        title: article.title,
        excerpt: article.excerpt,
        date: article.date,
        read_time: article.readTime,
        category: article.category,
        image: article.image,
        content: article.content,
        featured: article.featured || false,
        archived: article.archived || false,
        draft: article.draft || false,
      },
      { onConflict: 'id' }
    );
    if (error) console.warn('Supabase blog_articles sync warning:', error.message);
  } catch (err) {
    console.warn('Failed to sync article to Supabase:', err);
  }
}

export async function fetchArticlesFromSupabase(): Promise<BlogArticle[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.from('blog_articles').select('*');
    if (error || !data || data.length === 0) {
      // Auto-seed initial blog articles to Supabase if table is empty
      for (const art of BLOG_ARTICLES) {
        await syncArticleToSupabase(art);
      }
      return BLOG_ARTICLES;
    }
    return data.map((item) => ({
      id: item.id,
      title: item.title,
      excerpt: item.excerpt,
      date: item.date,
      readTime: item.read_time || '5 min read',
      category: item.category || 'Kitchen Stories',
      image: item.image,
      content: Array.isArray(item.content) ? item.content : [item.content],
      featured: item.featured || false,
      archived: item.archived || false,
      draft: item.draft || false,
    }));
  } catch {
    return null;
  }
}

export async function syncYouTubeVideoToSupabase(video: YouTubeVideo) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('youtube_videos').upsert(
      {
        id: video.id,
        title: video.title,
        duration: video.duration,
        thumbnail: video.thumbnail,
        video_id: video.videoId,
        published_at: video.publishedAt,
        description: video.description || null,
        series: video.series || null,
        featured: video.featured || false,
        archived: video.archived || false,
        draft: video.draft || false,
      },
      { onConflict: 'id' }
    );
    if (error) console.warn('Supabase youtube_videos sync warning:', error.message);
  } catch (err) {
    console.warn('Failed to sync video to Supabase:', err);
  }
}

export async function fetchYouTubeVideosFromSupabase(): Promise<YouTubeVideo[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.from('youtube_videos').select('*');
    if (error || !data || data.length === 0) {
      // Auto-seed initial youtube videos to Supabase if table is empty
      for (const vid of YOUTUBE_VIDEOS) {
        await syncYouTubeVideoToSupabase(vid);
      }
      return YOUTUBE_VIDEOS;
    }
    return data.map((item) => {
      const rawVideoId =
        item.video_id ||
        item.youtube_video_id ||
        item.youtubeVideoId ||
        item.videoId ||
        item.youtube_url ||
        item.video_url ||
        item.url;

      const cleanVideoId =
        extractYoutubeId(rawVideoId) ||
        (rawVideoId && typeof rawVideoId === 'string' && rawVideoId.trim().length === 11
          ? rawVideoId.trim()
          : item.id);

      // Dynamically point to updated thumbnail if thumbnail was a YouTube thumb or missing
      let cleanThumbnail = item.thumbnail;
      if (!cleanThumbnail || cleanThumbnail.includes('img.youtube.com/vi/')) {
        cleanThumbnail = `https://img.youtube.com/vi/${cleanVideoId}/hqdefault.jpg`;
      }

      return {
        id: item.id,
        title: item.title,
        duration: item.duration || '10:00',
        thumbnail: cleanThumbnail,
        videoId: cleanVideoId,
        publishedAt: item.published_at || 'Recently',
        description: item.description || undefined,
        series: item.series || undefined,
        featured: item.featured || false,
        archived: item.archived || false,
        draft: item.draft || false,
      };
    });
  } catch {
    return null;
  }
}

export async function syncAdminUserToSupabase(user: AdminUser) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('admin_users').upsert(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        joined_at: user.joinedAt,
        avatar: user.avatar || null,
      },
      { onConflict: 'id' }
    );
    if (error) console.warn('Supabase admin_users sync warning:', error.message);
  } catch (err) {
    console.warn('Failed to sync admin user to Supabase:', err);
  }
}

export async function fetchAdminUsersFromSupabase(): Promise<AdminUser[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.from('admin_users').select('*');
    if (error || !data || data.length === 0) {
      // Auto-seed initial admin users to Supabase if table is empty
      for (const usr of INITIAL_ADMIN_USERS) {
        await syncAdminUserToSupabase(usr);
      }
      return INITIAL_ADMIN_USERS;
    }
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      role: item.role || 'Editor',
      status: item.status || 'active',
      joinedAt: item.joined_at || '2023-10-01',
      avatar: item.avatar || undefined,
    }));
  } catch {
    return null;
  }
}

export async function syncSiteSettingsToSupabase(settings: SiteSettings) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('site_settings').upsert(
      {
        id: 'main',
        site_name: settings.siteName,
        tagline: settings.tagline,
        contact_email: settings.contactEmail,
        measurement_unit: settings.measurementUnit,
        auto_approve_comments: settings.autoApproveComments,
        enable_ratings: settings.enableRatings,
        smtp_configured: settings.smtpConfigured,
        welcome_email_enabled: settings.welcomeEmailEnabled,
        enforce_2fa: settings.enforce2FA,
      },
      { onConflict: 'id' }
    );
    if (error) console.warn('Supabase site_settings sync warning:', error.message);
  } catch (err) {
    console.warn('Failed to sync site settings to Supabase:', err);
  }
}

export async function fetchSiteSettingsFromSupabase(): Promise<SiteSettings | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.from('site_settings').select('*').single();
    if (error || !data) {
      // Auto-seed initial site settings to Supabase if empty
      await syncSiteSettingsToSupabase(DEFAULT_SITE_SETTINGS);
      return DEFAULT_SITE_SETTINGS;
    }
    return {
      siteName: data.site_name,
      tagline: data.tagline,
      contactEmail: data.contact_email,
      measurementUnit: data.measurement_unit,
      autoApproveComments: data.auto_approve_comments,
      enableRatings: data.enable_ratings,
      smtpConfigured: data.smtp_configured,
      welcomeEmailEnabled: data.welcome_email_enabled,
      enforce2FA: data.enforce_2fa,
    };
  } catch {
    return null;
  }
}

export async function deleteSubscriberFromSupabase(idOrEmail: string) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('subscribers').delete().or(`id.eq.${idOrEmail},email.eq.${idOrEmail}`);
    if (error) console.error('Supabase delete subscriber error:', error.message);
  } catch (err) {
    console.error('Failed to delete subscriber from Supabase:', err);
  }
}

export async function deleteNewsletterFromSupabase(id: string) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('newsletters').delete().eq('id', id);
    if (error) console.error('Supabase delete newsletter error:', error.message);
  } catch (err) {
    console.error('Failed to delete newsletter from Supabase:', err);
  }
}

export async function deleteRecipeFromSupabase(id: string) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('recipes').delete().eq('id', id);
    if (error) console.error('Supabase delete recipe error:', error.message);
  } catch (err) {
    console.error('Failed to delete recipe from Supabase:', err);
  }
}

export async function deleteArticleFromSupabase(id: string) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('blog_articles').delete().eq('id', id);
    if (error) console.error('Supabase delete article error:', error.message);
  } catch (err) {
    console.error('Failed to delete article from Supabase:', err);
  }
}

export async function deleteYouTubeVideoFromSupabase(id: string) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('youtube_videos').delete().eq('id', id);
    if (error) console.error('Supabase delete video error:', error.message);
  } catch (err) {
    console.error('Failed to delete video from Supabase:', err);
  }
}

export async function deleteAdminUserFromSupabase(id: string) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('admin_users').delete().eq('id', id);
    if (error) console.error('Supabase delete admin user error:', error.message);
  } catch (err) {
    console.error('Failed to delete admin user from Supabase:', err);
  }
}

let isContactMessagesTableMissing = false;

export async function syncContactMessageToSupabase(message: ContactMessage) {
  if (!isSupabaseConfigured || !supabase || isContactMessagesTableMissing) return;
  try {
    const { error } = await supabase.from('contact_messages').upsert(
      {
        id: message.id,
        name: message.name,
        email: message.email,
        subject: message.subject || '',
        message: message.message,
        created_at: message.createdAt,
        read: message.read || false,
      },
      { onConflict: 'id' }
    );
    if (error) {
      if (
        error.code === 'PGRST204' ||
        error.code === 'PGRST205' ||
        error.code === '42P01' ||
        error.message?.includes('contact_messages') ||
        error.message?.includes('relation') ||
        error.message?.includes('not found')
      ) {
        isContactMessagesTableMissing = true;
        return;
      }
      console.warn('Supabase contact message sync warning:', error.message);
    }
  } catch {
    isContactMessagesTableMissing = true;
  }
}

export async function fetchContactMessagesFromSupabase(): Promise<ContactMessage[] | null> {
  if (!isSupabaseConfigured || !supabase || isContactMessagesTableMissing) return null;
  try {
    const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (error) {
      if (
        error.code === 'PGRST204' ||
        error.code === 'PGRST205' ||
        error.code === '42P01' ||
        error.message?.includes('contact_messages') ||
        error.message?.includes('relation') ||
        error.message?.includes('not found')
      ) {
        isContactMessagesTableMissing = true;
      }
      return null;
    }
    if (!data) return null;
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      subject: item.subject || '',
      message: item.message,
      createdAt: item.created_at || item.createdAt || new Date().toISOString(),
      read: !!item.read,
    }));
  } catch {
    isContactMessagesTableMissing = true;
    return null;
  }
}

export async function deleteContactMessageFromSupabase(id: string) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) console.error('Supabase delete contact message error:', error.message);
  } catch (err) {
    console.error('Failed to delete contact message from Supabase:', err);
  }
}

let isPageAnalyticsTableMissing = false;

export async function syncAnalyticsEventToSupabase(event: AnalyticsEvent) {
  if (!isSupabaseConfigured || !supabase || isPageAnalyticsTableMissing) return;
  try {
    const { error } = await supabase.from('page_analytics').upsert(
      {
        id: event.id,
        event_type: event.eventType,
        item_id: event.itemId || null,
        item_title: event.itemTitle || null,
        path: event.path || null,
        user_agent: event.userAgent || null,
        created_at: event.createdAt,
      },
      { onConflict: 'id' }
    );
    if (error) {
      if (
        error.code === 'PGRST204' ||
        error.code === 'PGRST205' ||
        error.message?.includes('schema cache') ||
        error.message?.includes('page_analytics') ||
        error.message?.includes('relation')
      ) {
        // Table not created in Supabase yet; suppress to prevent console spam
        isPageAnalyticsTableMissing = true;
        return;
      }
      console.warn('Supabase analytics sync notice:', error.message);
    }
  } catch {
    isPageAnalyticsTableMissing = true;
  }
}

export async function fetchAnalyticsFromSupabase(): Promise<AnalyticsEvent[] | null> {
  if (!isSupabaseConfigured || !supabase || isPageAnalyticsTableMissing) return null;
  try {
    const { data, error } = await supabase
      .from('page_analytics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) {
      if (
        error.code === 'PGRST204' ||
        error.code === 'PGRST205' ||
        error.message?.includes('schema cache') ||
        error.message?.includes('page_analytics')
      ) {
        isPageAnalyticsTableMissing = true;
      }
      return null;
    }
    if (!data) return null;
    return data.map((item: any) => ({
      id: item.id,
      eventType: item.event_type || item.eventType || 'page_view',
      itemId: item.item_id || item.itemId || undefined,
      itemTitle: item.item_title || item.itemTitle || undefined,
      path: item.path || undefined,
      createdAt: item.created_at || item.createdAt || new Date().toISOString(),
      userAgent: item.user_agent || item.userAgent || undefined,
    }));
  } catch {
    return null;
  }
}

export async function clearAnalyticsFromSupabase() {
  if (!isSupabaseConfigured || !supabase || isPageAnalyticsTableMissing) return;
  try {
    const { error } = await supabase.from('page_analytics').delete().neq('id', '0');
    if (error) {
      if (
        error.code === 'PGRST204' ||
        error.code === 'PGRST205' ||
        error.message?.includes('schema cache') ||
        error.message?.includes('page_analytics')
      ) {
        isPageAnalyticsTableMissing = true;
        return;
      }
    }
  } catch {
    isPageAnalyticsTableMissing = true;
  }
}




