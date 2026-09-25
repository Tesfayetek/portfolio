import React from 'react';

interface TechSkillIconProps {
  skillName: string;
  className?: string;
  size?: number;
}

export const TechSkillIcon: React.FC<TechSkillIconProps> = ({
  skillName,
  className = 'w-6 h-6',
  size = 24,
}) => {
  const normalized = skillName.toLowerCase().trim();

  // JavaScript
  if (normalized.includes('javascript') || normalized === 'js') {
    return (
      <svg
        className={className}
        height={size}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect fill="#F7DF1E" height="24" rx="3" width="24" />
        <path
          d="M6.5 18.5c1.1.6 2.2.8 3.2.4.9-.4 1.4-1.2 1.4-2.4v-8.2h-2.3v8.1c0 .6-.3.9-.8 1-.4.1-.9 0-1.5-.3v1.4zm8.6.1c1.8.6 3.7.3 4.9-.7.9-.7 1.3-1.8 1.3-3.1 0-2.4-1.6-3.6-3.8-4.4-.9-.3-1.6-.6-1.6-1.1 0-.4.3-.8.9-.8.7 0 1.5.3 2.1.8l1.3-1.4c-.9-.8-2-1.2-3.4-1.2-1.8 0-3.1.9-3.1 2.6 0 2.2 1.5 3.3 3.6 4.1.9.4 1.7.7 1.7 1.3 0 .5-.4.9-1.1.9-.9 0-1.9-.4-2.7-1l-1.1 1.6c.3.1.6.3 1.2.4z"
          fill="#000000"
        />
      </svg>
    );
  }

  // React
  if (normalized.includes('react')) {
    return (
      <svg
        className={className}
        height={size}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse
          cx="12"
          cy="12"
          fill="none"
          rx="10.5"
          ry="4"
          stroke="#61DAFB"
          strokeWidth="1.5"
          transform="rotate(30 12 12)"
        />
        <ellipse
          cx="12"
          cy="12"
          fill="none"
          rx="10.5"
          ry="4"
          stroke="#61DAFB"
          strokeWidth="1.5"
          transform="rotate(90 12 12)"
        />
        <ellipse
          cx="12"
          cy="12"
          fill="none"
          rx="10.5"
          ry="4"
          stroke="#61DAFB"
          strokeWidth="1.5"
          transform="rotate(150 12 12)"
        />
        <circle cx="12" cy="12" fill="#61DAFB" r="2" />
      </svg>
    );
  }

  // Node.js
  if (normalized.includes('node')) {
    return (
      <svg
        className={className}
        height={size}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2l9 5.2v10.4L12 23l-9-5.4V7.2L12 2z"
          fill="#339933"
        />
        <path
          d="M12 3.5l7.5 4.3v8.6L12 20.7l-7.5-4.3V7.8L12 3.5z"
          fill="#026e00"
        />
        <path
          d="M12 7c-2.8 0-4.5 1.5-4.5 3.8 0 3.5 4.8 2.2 4.8 4.2 0 .5-.4.8-1.2.8-1 0-2.1-.4-2.8-1l-.9 1.4c1 .9 2.4 1.3 3.7 1.3 2.7 0 4.6-1.5 4.6-3.8 0-3.6-4.9-2.3-4.9-4.3 0-.5.4-.8 1.1-.8.8 0 1.8.3 2.5.8l.9-1.4C14.3 7.3 13.2 7 12 7z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // Python
  if (normalized.includes('python') || normalized === 'py') {
    return (
      <svg
        className={className}
        height={size}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.9 2c-4.4 0-4.1 1.9-4.1 1.9v2h4.2v.6H6.1S3 6.1 3 10.6c0 4.4 2.7 4.3 2.7 4.3h1.6v-2.3s-.1-2.7 2.7-2.7h4.6s2.6.1 2.6-2.5V5.5S17.4 2 11.9 2zm-1.8 1.7c.4 0 .8.3.8.8 0 .4-.3.8-.8.8-.4 0-.8-.3-.8-.8 0-.4.4-.8.8-.8z"
          fill="#3776AB"
        />
        <path
          d="M12.1 22c4.4 0 4.1-1.9 4.1-1.9v-2H12v-.6h5.9s3.1.4 3.1-4.1c0-4.4-2.7-4.3-2.7-4.3h-1.6v2.3s.1 2.7-2.7 2.7H9.4s-2.6-.1-2.6 2.5v1.9s-.2 3.5 5.3 3.5zm1.8-1.7c-.4 0-.8-.3-.8-.8 0-.4.3-.8.8-.8.4 0 .8.3.8.8 0 .4-.4.8-.8.8z"
          fill="#FFD43B"
        />
      </svg>
    );
  }

  // MySQL
  if (normalized.includes('mysql')) {
    return (
      <svg
        className={className}
        height={size}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect fill="#00758F" height="24" rx="4" width="24" />
        <path
          d="M6 17.5c2.5-3 5-4.5 9-3.5 1 .3 2.5 1 3.5.5.3-.2.5-.5.5-.8 0-.8-1-1.5-2.5-1.7-2.8-.4-5.2.8-7.5 2.5-.6.5-1.5 1-2 1.5l-1 1.5z"
          fill="#F29111"
        />
        <path
          d="M18.5 12c-.5-1.2-1.5-2.2-2.8-2.8-2-.9-4.2-.6-6.2.2-1.8.8-3.2 2-4.5 3.6 1.8-2.2 4-3.8 6.8-4.2 2.2-.3 4.5.2 6.2 1.6.4.4.8.8 1 1.3-.2.1-.3.2-.5.3z"
          fill="#FFFFFF"
        />
        <circle cx="17.5" cy="11.5" fill="#F29111" r="0.75" />
      </svg>
    );
  }

  // Oracle
  if (normalized.includes('oracle')) {
    return (
      <svg
        className={className}
        height={size}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect fill="#EA1B22" height="24" rx="4" width="24" />
        <ellipse
          cx="12"
          cy="12"
          fill="none"
          rx="7"
          ry="4.5"
          stroke="#FFFFFF"
          strokeWidth="2.5"
        />
      </svg>
    );
  }

  // Git
  if (normalized.includes('git')) {
    return (
      <svg
        className={className}
        height={size}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.6 10.6L13.4 2.4c-.8-.8-2.1-.8-2.8 0L8.7 4.3l3.6 3.6c.8-.3 1.8-.1 2.4.6.7.7.8 1.7.5 2.5l3.5 3.5c.8-.3 1.8-.1 2.5.5.9.9.9 2.5 0 3.4-.9.9-2.5.9-3.4 0-.8-.8-.9-1.9-.4-2.8l-3.3-3.3v4.6c.3.2.6.5.7.9.5 1.1 0 2.4-1.1 2.9-1.1.5-2.4 0-2.9-1.1-.4-.9-.1-2 .6-2.6V8.6c-.7-.6-1-1.6-.6-2.6l-3.5-3.5L2.4 10.6c-.8.8-.8 2.1 0 2.8l8.2 8.2c.8.8 2.1.8 2.8 0l8.2-8.2c.8-.8.8-2 0-2.8z"
          fill="#F05032"
        />
      </svg>
    );
  }

  // Linux
  if (normalized.includes('linux') || normalized.includes('ubuntu') || normalized.includes('debian')) {
    return (
      <svg
        className={className}
        height={size}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect fill="#1E293B" height="24" rx="4" width="24" />
        <path
          d="M12 3c-2.5 0-3.5 2-3.5 4.5 0 1.2.3 2.5.5 3.5-1.5.5-3 2-3 4 0 2.5 2.5 4.5 5 4.5h2c2.5 0 5-2 5-4.5 0-2-1.5-3.5-3-4 .2-1 .5-2.3.5-3.5C15.5 5 14.5 3 12 3z"
          fill="#FFFFFF"
        />
        <circle cx="10.5" cy="7" fill="#000000" r="1" />
        <circle cx="13.5" cy="7" fill="#000000" r="1" />
        <polygon fill="#FFA500" points="12,9 10.5,10.5 13.5,10.5" />
        <ellipse cx="8" cy="19.5" fill="#FFA500" rx="2.5" ry="1.2" />
        <ellipse cx="16" cy="19.5" fill="#FFA500" rx="2.5" ry="1.2" />
      </svg>
    );
  }

  // Docker
  if (normalized.includes('docker')) {
    return (
      <svg
        className={className}
        height={size}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.8 9.2h2v2h-2v-2zm-3 0h2v2h-2v-2zm-3 0h2v2h-2v-2zm9-3h2v2h-2v-2zm-3 0h2v2h-2v-2zm-3 0h2v2h-2v-2zm-3 0h2v2h-2v-2zm9 6h2v2h-2v-2zm-3 0h2v2h-2v-2zm-3 0h2v2h-2v-2zm-3 0h2v2h-2v-2zm-3 0h2v2h-2v-2z"
          fill="#2496ED"
        />
        <path
          d="M23.5 12.8c-.4-.3-1.4-.4-2.1-.1-.3-.7-.9-1.2-1.8-1.4-.1 0-.3 0-.4.1-.1 0-.1.1-.1.2 0 1.2.6 2.3 1.6 2.8-.5 1.5-1.5 2.6-3 3.3-2.1 1-4.7 1-7.2.2-2.1-.7-3.8-2.2-4.8-4.2-.3-.5-.4-1.1-.5-1.7H2.8c-.5 0-.9.4-.9.9 0 2.2 1.3 4.2 3.3 5.2 2.3 1.2 5.1 1.3 7.6.6 2.3-.6 4.3-2.2 5.5-4.2 1.6-.3 3.6-1.5 4.3-3.7.1-.4 0-.7-.4-.8z"
          fill="#2496ED"
        />
      </svg>
    );
  }

  // Visual Studio Code
  if (normalized.includes('vscode') || normalized.includes('visual studio') || normalized.includes('vs code')) {
    return (
      <svg
        className={className}
        height={size}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.8 2.2l4.4 2.1c.5.2.8.8.8 1.4v12.6c0 .6-.3 1.1-.8 1.4l-4.4 2.1c-.6.3-1.3.1-1.7-.4L9.5 14.7 5.7 17.6c-.4.3-.9.3-1.3 0L1.4 15.3c-.5-.4-.6-1.1-.2-1.5L4.8 12 1.2 8.2c-.4-.4-.3-1.1.2-1.5l3-2.3c.4-.3.9-.3 1.3 0l3.8 2.9 6.6-6.7c.4-.5 1.1-.7 1.7-.4z"
          fill="#007ACC"
        />
        <path
          d="M18 6.5v11l-7-5.5 7-5.5z"
          fill="#FFFFFF"
          opacity="0.9"
        />
      </svg>
    );
  }

  // Cisco / Networking
  if (normalized.includes('cisco') || normalized.includes('networking')) {
    return (
      <svg
        className={className}
        height={size}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect fill="#005073" height="24" rx="4" width="24" />
        <path
          d="M4 14v4M6 11v7M8 13v5M10 8v10M12 6v12M14 8v10M16 13v5M18 11v7M20 14v4"
          stroke="#1BA0D7"
          strokeLinecap="round"
          strokeWidth="1.75"
        />
      </svg>
    );
  }

  // Network Security / Security
  if (normalized.includes('security') || normalized.includes('firewall') || normalized.includes('cyber')) {
    return (
      <svg
        className={className}
        height={size}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L4 5.5v6.2c0 5.4 3.4 10.4 8 11.6 4.6-1.2 8-6.2 8-11.6V5.5L12 2z"
          fill="#0F172A"
          stroke="#38BDF8"
          strokeWidth="1.5"
        />
        <path
          d="M12 8c-1.7 0-3 1.3-3 3v2h6v-2c0-1.7-1.3-3-3-3zm-2 5v4h4v-4h-4z"
          fill="#38BDF8"
        />
      </svg>
    );
  }

  // HTML / HTML5
  if (normalized.includes('html')) {
    return (
      <svg
        className={className}
        height={size}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M3 2l1.6 18.2L12 22l7.4-1.8L21 2H3z" fill="#E34F26" />
        <path d="M12 3.6v16.7l5.8-1.5 1.3-15.2H12z" fill="#EF652A" />
        <path
          d="M12 7.7H7.7l.3 3.4H12V7.7zm0 5.7H9.7l.2 2.3 2.1.6v-2.9zm4.3-5.7H12v3.4h4.1l-.4 4.5-3.7 1v2.3l6.2-1.7.8-9.5z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // CSS / CSS3
  if (normalized.includes('css')) {
    return (
      <svg
        className={className}
        height={size}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M3 2l1.6 18.2L12 22l7.4-1.8L21 2H3z" fill="#1572B6" />
        <path d="M12 3.6v16.7l5.8-1.5 1.3-15.2H12z" fill="#33A9DC" />
        <path
          d="M12 7.7H7.7l.3 3.4H12V7.7zm0 5.7H9.7l.2 2.3 2.1.6v-2.9zm4.3-5.7H12v3.4h4.1l-.4 4.5-3.7 1v2.3l6.2-1.7.8-9.5z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // ASP.NET / .NET
  if (normalized.includes('.net') || normalized.includes('asp') || normalized.includes('c#')) {
    return (
      <svg
        className={className}
        height={size}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect fill="#512BD4" height="24" rx="4" width="24" />
        <path
          d="M5 16V8h2.5l2.8 5.2V8H12v8H9.5L6.7 10.8V16H5zm9-1.5c0-.6.4-1 1-1s1 .4 1 1-.4 1-1 1-1-.4-1-1zm3.5-5.5v1.2H19v1.2h-1.5v3.4c0 .5.2.7.7.7h.8v1.2c-.4.1-.9.1-1.3.1-1.3 0-1.9-.6-1.9-1.8v-3.6H15v-1.2h.8V9h1.7z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // Windows Server / Windows
  if (normalized.includes('windows') || normalized.includes('microsoft')) {
    return (
      <svg
        className={className}
        height={size}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect fill="#0078D7" height="24" rx="4" width="24" />
        <path
          d="M4 11.2h6.8V4.4L4 5.4v5.8zm7.8 0H20V3l-8.2 1.2v7zm0 1.6V20l8.2 1.2v-8.4h-8.2zm-7.8 0v5.8l6.8 1v-6.8H4z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // VMware
  if (normalized.includes('vmware') || normalized.includes('virtualization')) {
    return (
      <svg
        className={className}
        height={size}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect fill="#23272A" height="24" rx="4" width="24" />
        <path
          d="M7 6l5-3 5 3v6l-5 3-5-3V6zm0 6l5 3 5-3v6l-5 3-5-3v-6z"
          fill="none"
          stroke="#48A9A6"
          strokeWidth="1.5"
        />
      </svg>
    );
  }

  // cPanel
  if (normalized.includes('cpanel')) {
    return (
      <svg
        className={className}
        height={size}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect fill="#FF6C2C" height="24" rx="4" width="24" />
        <path
          d="M17 9.5c-.8-1-2-1.5-3.3-1.5-2.6 0-4.7 2.1-4.7 4.7 0 2.6 2.1 4.7 4.7 4.7 1.4 0 2.6-.6 3.4-1.6l-1.6-1.2c-.4.5-1.1.8-1.8.8-1.5 0-2.7-1.2-2.7-2.7s1.2-2.7 2.7-2.7c.7 0 1.3.3 1.7.7L17 9.5z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // Firebase
  if (normalized.includes('firebase')) {
    return (
      <svg
        className={className}
        height={size}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4.6 17.5L7.8 2.2c.1-.4.6-.5.9-.2l4 6.8L4.6 17.5z" fill="#FFA000" />
        <path d="M14.6 7.4l-1.9-3.6c-.2-.4-.8-.4-1 0L4.5 17.5l10.1-10.1z" fill="#F57C00" />
        <path d="M19.4 17.5L16.2 9.5l-11.7 8 6.5 4c.6.4 1.4.4 2 0l6.4-4z" fill="#FFCA28" />
      </svg>
    );
  }

  // TypeScript
  if (normalized.includes('typescript') || normalized === 'ts') {
    return (
      <svg
        className={className}
        height={size}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect fill="#3178C6" height="24" rx="3" width="24" />
        <path
          d="M4.5 10.5h6v1.8H8.7V19H6.9v-6.7H4.5v-1.8zm8.1 4.7c.7.4 1.5.7 2.3.7.8 0 1.3-.3 1.3-.8 0-.5-.4-.7-1.5-1-1.6-.4-2.5-1.1-2.5-2.2 0-1.4 1.1-2.4 2.9-2.4 1 0 1.9.3 2.5.6l-.6 1.6c-.5-.3-1.1-.5-1.9-.5-.8 0-1.2.3-1.2.7 0 .4.4.6 1.4.9 1.7.5 2.5 1.1 2.5 2.3 0 1.5-1.2 2.4-3.1 2.4-1.1 0-2.2-.3-2.9-.8l.7-1.5z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // Database / SQL fallback
  if (normalized.includes('database') || normalized.includes('sql') || normalized.includes('dba')) {
    return (
      <svg
        className={className}
        height={size}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="12" cy="6" fill="#0284C7" rx="8" ry="3" />
        <path
          d="M4 6v5c0 1.7 3.6 3 8 3s8-1.3 8-3V6"
          fill="none"
          stroke="#0284C7"
          strokeWidth="2"
        />
        <path
          d="M4 11v5c0 1.7 3.6 3 8 3s8-1.3 8-3v-5"
          fill="none"
          stroke="#0284C7"
          strokeWidth="2"
        />
      </svg>
    );
  }

  // General Technology / Terminal / Systems fallback
  return (
    <svg
      className={className}
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        fill="#0F172A"
        height="18"
        rx="3"
        stroke="#38BDF8"
        strokeWidth="1.5"
        width="20"
        x="2"
        y="3"
      />
      <path
        d="M6 8l4 4-4 4M12 16h6"
        fill="none"
        stroke="#38BDF8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
};
