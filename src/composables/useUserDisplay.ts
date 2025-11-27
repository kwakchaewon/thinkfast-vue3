/**
 * 사용자 표시 이름을 반환합니다.
 * realUsername이 있으면 realUsername을, 없으면 username을 반환합니다.
 */
export const getDisplayName = (
  realUsername: string | null | undefined,
  username: string
): string => {
  return realUsername?.trim() || username;
};

