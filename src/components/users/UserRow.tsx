import Avatar from '@/components/ui/Avatar';

export default function UserRow({ user }: { user: any }) {
  return (
    <div className="grid grid-cols-6 items-center py-3 border-b text-sm text-[#303030]">
      <div className="flex items-center gap-2">
        <Avatar src={user.avatar} alt={user.name} size={32} />
        {user.name}
      </div>
      <div>{user.email}</div>
      <div>{user.userType}</div>
      <div>{user.joinDate}</div>
      <div>{user.lastActivity}</div>
      <div>{user.status}</div>
    </div>
  )
}
