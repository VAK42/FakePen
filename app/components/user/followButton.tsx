import { useFetcher } from 'react-router';
import { Button } from '../ui/button';
interface FollowButtonProps {
  userId: number;
  isFollowing: boolean;
}
export function FollowButton({ userId, isFollowing }: FollowButtonProps) {
  const fetcher = useFetcher();
  const handleClick = () => {
    fetcher.submit({}, { method: 'post', action: `/api/users/${userId}/follow` });
  };
  return (
    <Button
      onClick={handleClick}
      variant={isFollowing ? 'outline' : 'default'}
      size="sm"
      disabled={fetcher.state === 'submitting'}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  )
}