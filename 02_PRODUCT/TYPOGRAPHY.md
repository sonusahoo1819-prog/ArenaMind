# TYPOGRAPHY SYSTEM

**Project:** ArenaMind

Version: 1.0

Document Type: Design System — Typography

---

# Purpose

Typography is the primary communication layer of ArenaMind.

The typography system is designed to maximize readability, accessibility, hierarchy, responsiveness, and international support while maintaining a premium visual identity.

Every piece of text in ArenaMind must follow this specification.

---

# Design Philosophy

Typography should feel:

• Premium

• Clean

• Modern

• Human

• Calm

• Confident

• Professional

• Accessible

The typography should never compete with the content.

Instead, it should help users process information effortlessly.

---

# Primary Typeface

Preferred Font

Inter Variable

Reasons

• Excellent readability

• Variable font support

• Optimized for dashboards

• High performance

• Beautiful at every size

• Excellent multilingual rendering

Fallback Fonts

Inter

Segoe UI

Roboto

Helvetica Neue

Arial

sans-serif

---

# Monospace Typeface

JetBrains Mono

Fallback

Fira Code

Consolas

Monaco

monospace

Used For

• API Keys

• Logs

• Terminal Output

• Code Snippets

• AI Debug Information

---

# Font Weights

100 Thin

200 Extra Light

300 Light

400 Regular

500 Medium

600 Semi Bold

700 Bold

800 Extra Bold

900 Black

Recommended Usage

Regular

Body text

Medium

Buttons

SemiBold

Cards

Bold

Titles

ExtraBold

Hero Sections only

---

# Typography Scale

Display XXL

72px

Display XL

64px

Display Large

56px

Heading 1

48px

Heading 2

40px

Heading 3

32px

Heading 4

28px

Heading 5

24px

Heading 6

20px

Body Large

18px

Body

16px

Body Small

14px

Caption

12px

Overline

11px

Micro

10px

Never use font sizes below 12px for essential information.

---

# Line Height

Display

110%

Heading

120%

Body

150%

Caption

140%

Tables

140%

Chat Messages

160%

Long Articles

170%

---

# Letter Spacing

Display

-2%

Heading

-1%

Body

0%

Caption

1%

Buttons

1%

Uppercase Labels

4%

---

# Text Alignment

Default

Left

Dashboard Numbers

Right

Tables

Left

Buttons

Center

Cards

Left

Statistics

Center

Forms

Left

AI Messages

Left

---

# Heading Hierarchy

H1

Main Page Title

H2

Section Title

H3

Widget Title

H4

Card Title

H5

Panel Title

H6

Small Group Heading

Hierarchy must never be skipped.

---

# Body Text

Primary Body

16px

Regular

Secondary Body

14px

Regular

Descriptions

14px

Muted

Supporting Text

12px

Muted

---

# Dashboard Typography

Metrics

Bold

Large

Highly visible

Labels

Small

Medium

Charts

Medium

Tables

Regular

Widget Titles

SemiBold

---

# AI Conversation Typography

User Messages

16px

Regular

Assistant Messages

16px

Regular

AI Suggestions

14px

Medium

System Messages

13px

Muted

Confidence Labels

12px

SemiBold

Timestamps

11px

Muted

---

# Numeric Typography

Numbers should use:

Tabular Figures

Used For

Analytics

Dashboards

Leaderboards

Tables

Countdown Timers

Statistics

Financial Data

This prevents numbers from shifting during updates.

---

# Form Typography

Labels

14px

Medium

Placeholder

14px

Muted

Validation

13px

Regular

Error

13px

Medium

Help Text

12px

Regular

---

# Button Typography

Primary Button

16px

Medium

Secondary Button

16px

Medium

Icon Button

14px

Medium

Never use bold buttons.

---

# Navigation Typography

Sidebar

15px

Medium

Top Navigation

15px

Medium

Breadcrumbs

13px

Regular

Menu Labels

14px

Medium

---

# Card Typography

Title

18px

SemiBold

Subtitle

14px

Regular

Description

14px

Regular

Meta Information

12px

Muted

---

# Table Typography

Headers

14px

SemiBold

Body

14px

Regular

Footer

13px

Regular

Status

13px

Medium

---

# Accessibility Rules

Minimum body size

16px

Minimum interactive text

14px

Minimum contrast

WCAG AA

Preferred

WCAG AAA

Text must scale to 200% without layout issues.

---

# Responsive Typography

Desktop

100%

Tablet

95%

Mobile

90%

Large Displays

110%

Typography should adapt fluidly using CSS clamp() where appropriate.

---

# Multilingual Support

Typography must support:

English

Arabic

French

Spanish

Portuguese

German

Hindi

Japanese

Chinese

Korean

RTL languages must be fully supported.

---

# Text Overflow

Never truncate important information.

Use

• Wrapping

• Expandable Sections

• Tooltips

• Progressive Disclosure

Avoid ellipsis for critical content.

---

# Performance

Load only required font weights.

Prefer variable fonts.

Preload primary font.

Use font-display: swap.

Avoid layout shifts.

---

# Typography Tokens

Typography must be exposed through design tokens.

Examples

font.display.xxl

font.heading.h1

font.heading.h2

font.body.large

font.body.default

font.body.small

font.caption

font.code

font.button

font.table

font.chat

---

# Typography Do's

✓ Maintain consistent hierarchy

✓ Keep generous spacing

✓ Use sentence case

✓ Optimize readability

✓ Prioritize accessibility

✓ Support multilingual layouts

---

# Typography Don'ts

✗ Random font sizes

✗ Multiple font families

✗ All caps paragraphs

✗ Tiny body text

✗ Decorative fonts

✗ Poor contrast

✗ Inconsistent spacing

---

# Success Criteria

The typography system succeeds when:

• Users can scan interfaces quickly.

• Long reading sessions remain comfortable.

• Dashboards remain highly legible.

• AI conversations feel natural.

• Accessibility standards are exceeded.

• The interface maintains a premium appearance across all devices.

---

# Final Statement

Typography is one of ArenaMind's strongest design assets.

A consistent, accessible, and elegant typography system enables users to focus on information rather than interface, reinforcing trust, clarity, and professionalism throughout the product.

---

End of Document
