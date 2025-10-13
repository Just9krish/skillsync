'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Upload, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { updateProfilePicture } from '@/actions/profile';
import { toast } from 'sonner';
import { useConfirm } from '@/hooks/use-confirm';

export function ProfilePicture() {
  const [isUploading, setIsUploading] = useState(false);
  const { data, isPending, error } = useSession();
  const { confirmRemove } = useConfirm();

  const user = data?.user;
  const [avatar, setAvatar] = useState(user?.image || '');

  const handleAvatarUpload = async () => {
    setIsUploading(true);

    try {
      // TODO: Implement Supabase storage upload
      // For now, this is a placeholder
      toast.info(
        'Profile picture upload will be available soon with Supabase integration'
      );

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // When Supabase is set up, you would:
      // 1. Upload file to Supabase storage
      // 2. Get the public URL
      // 3. Call updateProfilePicture with the URL
      // const result = await updateProfilePicture(imageUrl);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAvatarRemove = async () => {
    try {
      const result = await updateProfilePicture('');

      if (result.success) {
        setAvatar('');
        toast.success('Profile picture removed successfully');
      } else {
        toast.error(result.error || 'Failed to remove profile picture');
      }
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast.error('Failed to remove profile picture');
    }
  };

  const handleRemoveClick = () => {
    confirmRemove('profile picture', handleAvatarRemove);
  };

  if (isPending) {
    return (
      <div className="flex items-center gap-6">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatar} alt="Profile picture" />
        <AvatarFallback className="text-lg font-semibold">
          {user?.name
            ?.split(' ')
            .map((n: string) => n[0])
            .join('') || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <h3 className="font-semibold">Profile Picture</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAvatarUpload}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-1" />
            {isUploading ? 'Uploading...' : 'Upload New'}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleRemoveClick}>
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
