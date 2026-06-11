export function resolveImageUrl(obj: any): string | undefined {
  if (!obj) return undefined;
  const baseApi = process.env.NEXT_PUBLIC_BACK_OFFICE_API_URL || 'https://apis.dojoconnect.app/api';
  const cloudBase = process.env.NEXT_PUBLIC_CLOUDINARY_BASE || '';

  const candidates = [
    'avatarUrl','avatar','imageUrl','image_url','image','profileImage','cloudinary_url','profile_picture','picture'
  ];

  for (const k of candidates) {
    const v = obj[k];
    if (!v) continue;
    if (typeof v === 'string') {
      if (v.startsWith('http')) return v;
      if (v.startsWith('/')) return `${baseApi}${v}`;
      return `${baseApi}/${v}`;
    }
  }

  // public id fields
  const publicId = obj.avatarPublicId || obj.avatar_public_id || obj.imagePublicId || obj.image_public_id || obj.public_id;
  if (publicId) {
    if (cloudBase) return `${cloudBase}/${publicId}`;
    return `${baseApi}/images/${publicId}`;
  }

  if (obj.image_path) return `${baseApi}/${String(obj.image_path).replace(/^\//, '')}`;

  return undefined;
}
