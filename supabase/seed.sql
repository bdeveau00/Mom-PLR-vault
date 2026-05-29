INSERT INTO public.content_assets (title, slug, category, description, month, file_url, file_type)
VALUES
  ('How to Make Your First $1,000 Online as a Mom', 'how-to-make-your-first-1000', 'ebook', 'A step-by-step guide to earning real income from home', 1, 'month1/ebook_first_1000.md', 'text/markdown'),
  ('Profitable Mom Welcome Sequence', 'profitable-mom-welcome-sequence', 'email', '5-day email sequence to build trust and guide subscribers', 1, 'month1/email_sequence_5day.md', 'text/markdown'),
  ('My Profitable Mom Roadmap', 'my-profitable-mom-roadmap', 'workbook', 'A done-for-you workbook to plan your online income journey', 1, 'month1/workbook_roadmap.md', 'text/markdown'),
  ('20 Money-Making Prompts for Moms', '20-money-making-prompts', 'prompts', 'ChatGPT prompt pack for creating content and planning your business', 1, 'month1/chatgpt_prompt_pack.md', 'text/markdown'),
  ('Social Media Copy/Paste Pack', 'social-media-copy-paste-pack', 'social', '10 ready-to-post social media posts for mom entrepreneurs', 1, 'month1/social_media_posts.md', 'text/markdown'),
  ('Reel Script Pack for Mom Entrepreneurs', 'reel-script-pack', 'reels', '5 short-form video scripts for Instagram Reels and TikTok', 1, 'month1/reel_scripts.md', 'text/markdown'),
  ('Mom''s Guide to Online Income — Module 1', 'moms-guide-module-1', 'course', 'Finding Your Money-Making Path foundation module', 1, 'month1/course_module1.md', 'text/markdown')
ON CONFLICT (slug) DO NOTHING;
