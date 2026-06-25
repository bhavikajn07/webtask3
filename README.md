<div align="center">

# NEURABOT — Interactive Parallax

### Multi-Layer Scroll Depth + Pixel Robot Pet

A cyberpunk parallax experience with five depth layers and an interactive draggable robot pet.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)

</div>

---

## About

A multi-layer parallax scrolling page where each layer moves at a different speed based on scroll position and mouse movement, creating a 3D depth illusion. Features an interactive pixel art robot pet with emotional states.

---

## Parallax Layers

| Layer | Element | Speed | Depth |
|-------|---------|-------|-------|
| 01 | Background Stars | 0.1x | Far |
| 02 | Grid Floor | 0.25x | Mid-Far |
| 03 | Floating Orbs | 0.4x | Mid |
| 04 | Particle Field | 0.6x | Mid-Near |
| 05 | Content Layer | 0.8x | Near |

---

## Robot Pet Features

| State | Behavior |
|-------|----------|
| **Happy** | Default floating animation |
| **Typing** | Arm wiggle, mouth open/close, head tilt when typing in contact form |
| **Angry** | Red eyes, flicker effect, frown if dragged 5+ times in 1 minute |
| **Resting** | 5-second cooldown with zzZ animation after anger |
| **Hover** | Head tilts on mouse hover |

---

## Tech Stack

- **HTML5** — Semantic markup with ARIA labels
- **CSS3** — Parallax layers, keyframe animations, glassmorphism
- **JavaScript** — Vanilla JS, IntersectionObserver, touch drag-and-drop
- **Fonts** — Orbitron, Space Grotesk, Inter (Google Fonts)
- **Icons** — Font Awesome 6.5

---

## Sections

| Section | Features |
|---------|----------|
| **Hero** | 5-layer parallax with stars, grid, orbs, particles |
| **Layers** | Breakdown of each parallax layer with speed info |
| **Features** | 6 glassmorphism cards with hover tilt |
| **About** | Holographic helmet image, tech tags, stats |
| **Testimonials** | 3 user review cards with star ratings |
| **Contact** | Working form with validation + robot typing mimic |

---
