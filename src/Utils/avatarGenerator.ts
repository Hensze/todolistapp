export default function AvatarGenerator(text?: string) {
  // implement random text generate here for random avatars

  return `https://api.multiavatar.com/${text || "random"}.png
`;
}
