import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Logotipo CacTech: cacto em forma de trilha de circuito + nome. */
@Component({
  selector: 'app-logo',
  imports: [RouterLink],
  template: `
    <a routerLink="/" class="brand" aria-label="CacTech — página inicial">
      <svg class="mark" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="#C8FF00" />
        <g fill="none" stroke="#101010" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 25V10" />
          <path d="M16 19h-3.5a2.5 2.5 0 0 1-2.5-2.5V13" />
          <path d="M16 16h3.5a2.5 2.5 0 0 0 2.5-2.5V11" />
          <path d="M11 25h10" />
        </g>
        <g fill="#101010">
          <circle cx="16" cy="8" r="2" />
          <circle cx="10" cy="11" r="2" />
          <circle cx="22" cy="9" r="2" />
        </g>
      </svg>
      <span class="name">Cac<span>Tech</span></span>
    </a>
  `,
  styles: `
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    .mark {
      width: 36px;
      height: 36px;
    }
    .name {
      font-size: 1.35rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--text);
    }
    .name span {
      color: var(--accent);
    }
  `
})
export class LogoComponent {}
