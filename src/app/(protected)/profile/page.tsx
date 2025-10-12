import { Card } from '@/components/ui/card';
import { ProfilePicture } from './_components/profile-picture';
import { ProfileForm } from './_components/profile-form';

export default function Profile() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Profile Picture Section */}
          <ProfilePicture />

          {/* Separator */}
          <hr className="border-border" />

          {/* Profile Information Section */}
          <ProfileForm />
        </div>
      </Card>
    </div>
  );
}
