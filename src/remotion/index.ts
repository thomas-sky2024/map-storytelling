import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';
import '../index.css'; // Ensure Tailwind and global styles are loaded in Remotion

registerRoot(RemotionRoot);
