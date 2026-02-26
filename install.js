#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const HOME = process.env.HOME || process.env.USERPROFILE;
const CLAUDE_DIR = path.join(HOME, '.claude');
const AGENTS_DIR = path.join(CLAUDE_DIR, 'agents');
const SKILLS_DIR = path.join(CLAUDE_DIR, 'skills');
const SUPABUILDER_DIR = path.join(CLAUDE_DIR, 'supabuilder');
const REFERENCE_DIR = path.join(SUPABUILDER_DIR, 'reference');
const TEMPLATES_DIR = path.join(SUPABUILDER_DIR, 'templates');

const SRC_AGENTS = path.join(__dirname, 'agents');
const SRC_SKILLS = path.join(__dirname, 'skills');
const SRC_REFERENCE = path.join(__dirname, 'reference');
const SRC_TEMPLATES = path.join(__dirname, 'templates');

// Old skill dirs to clean up on upgrade
const OLD_SKILL_DIRS = ['start', 'sprint', 'develop', 'review', 'mode', 'init', 'status', '_shared'];

// Old agent files to clean up on upgrade
const OLD_AGENT_FILES = ['supabuilder-shared-context.md'];

// Old files to warn about
const OLD_FILES = [
  { path: path.join(CLAUDE_DIR, 'supabuilder-context.md'), name: 'supabuilder-context.md' },
  { path: path.join(CLAUDE_DIR, 'supabuilder-state.json'), name: 'supabuilder-state.json' },
];

// ─── Uninstall ────────────────────────────────────────────

if (process.argv.includes('--uninstall')) {
  console.log('\n  Supabuilder Uninstaller\n');

  // Remove agents (with backup restore)
  const agentFiles = fs.readdirSync(SRC_AGENTS).filter(f => f.endsWith('.md'));
  let removed = 0;

  console.log('  Removing agents...');
  for (const agent of agentFiles) {
    const dest = path.join(AGENTS_DIR, agent);
    const backup = dest + '.backup';
    if (fs.existsSync(dest)) {
      fs.unlinkSync(dest);
      removed++;
    }
    if (fs.existsSync(backup)) {
      fs.renameSync(backup, dest);
      console.log(`    Restored backup of ${agent}`);
    }
  }
  console.log(`    ${removed} agents removed\n`);

  // Remove skills
  const skillDirs = fs.readdirSync(SRC_SKILLS).filter(f => {
    return fs.statSync(path.join(SRC_SKILLS, f)).isDirectory();
  });

  console.log('  Removing skills...');
  let skillsRemoved = 0;
  for (const skill of skillDirs) {
    const destSkill = path.join(SKILLS_DIR, skill);
    if (fs.existsSync(destSkill)) {
      fs.rmSync(destSkill, { recursive: true });
      skillsRemoved++;
    }
  }
  console.log(`    ${skillsRemoved} skills removed\n`);

  // Clean up old skill dirs if present
  let oldCleaned = 0;
  for (const oldDir of OLD_SKILL_DIRS) {
    const oldPath = path.join(SKILLS_DIR, oldDir);
    if (fs.existsSync(oldPath)) {
      fs.rmSync(oldPath, { recursive: true });
      oldCleaned++;
    }
  }
  if (oldCleaned > 0) {
    console.log(`  Cleaned up ${oldCleaned} old skill dirs\n`);
  }

  // Remove supabuilder reference + templates
  if (fs.existsSync(SUPABUILDER_DIR)) {
    fs.rmSync(SUPABUILDER_DIR, { recursive: true });
    console.log('  Removed ~/.claude/supabuilder/ (reference + templates)\n');
  }

  console.log('  ────────────────────────────────────────────');
  console.log('  Supabuilder uninstalled.\n');
  console.log('  Backup agent files were restored where available.');
  console.log('  Project workspaces (supabuilder/ folders) are untouched.');
  console.log('  ────────────────────────────────────────────\n');
  process.exit(0);
}

// ─── Install ──────────────────────────────────────────────

const TAGLINES = [
  'Your product team in a terminal.',
  'Ship it before the standup.',
  'Six agents. One vision. Zero meetings.',
  'Product-first. Always.',
  'From idea to deployed — no ticket required.',
  'The PM that never sleeps.',
  'Less process, more product.',
  'Think big, ship small, iterate fast.',
  'Your codebase, understood.',
  'Build what matters. Skip what doesn\'t.',
  'Agents argue so you don\'t have to.',
  'Where diagrams become deployments.',
  'All the product thinking. None of the overhead.',
  'Move fast and document things.',
  'The orchestrator is listening.',
];
const tagline = TAGLINES[Math.floor(Math.random() * TAGLINES.length)];

console.log('');
console.log('  ███████╗██╗   ██╗██████╗  █████╗');
console.log('  ██╔════╝██║   ██║██╔══██╗██╔══██╗');
console.log('  ███████╗██║   ██║██████╔╝███████║');
console.log('  ╚════██║██║   ██║██╔═══╝ ██╔══██║');
console.log('  ███████║╚██████╔╝██║     ██║  ██║');
console.log('  ╚══════╝ ╚═════╝ ╚═╝     ╚═╝  ╚═╝');
console.log('           B U I L D E R');
console.log('');
console.log(`  v0.2.6 — "${tagline}"`);
console.log('');

// Ensure directories exist
for (const dir of [CLAUDE_DIR, AGENTS_DIR, SKILLS_DIR, SUPABUILDER_DIR, REFERENCE_DIR, TEMPLATES_DIR]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 1. Install agents
console.log('  Installing agents...');
const agents = fs.readdirSync(SRC_AGENTS).filter(f => f.endsWith('.md'));
let agentCount = 0;
for (const agent of agents) {
  const src = path.join(SRC_AGENTS, agent);
  const dest = path.join(AGENTS_DIR, agent);
  if (fs.existsSync(dest)) {
    const backup = dest + '.backup';
    fs.copyFileSync(dest, backup);
    console.log(`    Backed up existing ${agent}`);
  }
  fs.copyFileSync(src, dest);
  agentCount++;
}
console.log(`    ${agentCount} agents installed\n`);

// 2. Install skills
console.log('  Installing skills...');
const skills = fs.readdirSync(SRC_SKILLS).filter(f => {
  return fs.statSync(path.join(SRC_SKILLS, f)).isDirectory();
});

let skillCount = 0;
for (const skill of skills) {
  const srcSkill = path.join(SRC_SKILLS, skill);
  const destSkill = path.join(SKILLS_DIR, skill);
  if (!fs.existsSync(destSkill)) {
    fs.mkdirSync(destSkill, { recursive: true });
  }
  copyDirRecursive(srcSkill, destSkill);
  skillCount++;
}
console.log(`    ${skillCount} skills installed\n`);

// 3. Install reference files
console.log('  Installing reference files...');
let refCount = 0;
if (fs.existsSync(SRC_REFERENCE)) {
  copyDirRecursive(SRC_REFERENCE, REFERENCE_DIR);
  refCount = fs.readdirSync(SRC_REFERENCE).filter(f => f.endsWith('.md')).length;
}
console.log(`    ${refCount} reference files installed\n`);

// 4. Install templates
console.log('  Installing templates...');
let templateCount = 0;
if (fs.existsSync(SRC_TEMPLATES)) {
  copyDirRecursive(SRC_TEMPLATES, TEMPLATES_DIR);
  templateCount = fs.readdirSync(SRC_TEMPLATES).filter(f => f.endsWith('.md')).length;
}
console.log(`    ${templateCount} templates installed\n`);

// 5. Upgrade cleanup — remove old skill dirs
let oldRemoved = 0;
for (const oldDir of OLD_SKILL_DIRS) {
  const oldPath = path.join(SKILLS_DIR, oldDir);
  if (fs.existsSync(oldPath)) {
    fs.rmSync(oldPath, { recursive: true });
    oldRemoved++;
  }
}
if (oldRemoved > 0) {
  console.log(`  Upgrade: removed ${oldRemoved} old skill dirs (replaced by new commands)\n`);
}

// 5b. Upgrade cleanup — remove old agent files
let oldAgentsRemoved = 0;
for (const oldAgent of OLD_AGENT_FILES) {
  const agentPath = path.join(AGENTS_DIR, oldAgent);
  const backupPath = agentPath + '.backup';
  if (fs.existsSync(agentPath)) {
    fs.unlinkSync(agentPath);
    oldAgentsRemoved++;
  }
  if (fs.existsSync(backupPath)) {
    fs.unlinkSync(backupPath);
  }
}
if (oldAgentsRemoved > 0) {
  console.log(`  Upgrade: removed ${oldAgentsRemoved} old agent files (content moved to reference files)\n`);
}

// 6. Warn about old files
for (const oldFile of OLD_FILES) {
  if (fs.existsSync(oldFile.path)) {
    console.log(`  Note: Found old ${oldFile.name} in ~/.claude/`);
    console.log(`    The new version uses supabuilder/state.json and .claude/CLAUDE.md instead.`);
    console.log(`    You can safely delete ~/.claude/${oldFile.name}\n`);
  }
}

// Done
console.log('  ────────────────────────────────────────────');
console.log('  Installed!\n');
console.log('  Agents:     ~/.claude/agents/');
console.log('  Skills:     ~/.claude/skills/');
console.log('  Reference:  ~/.claude/supabuilder/reference/');
console.log('  Templates:  ~/.claude/supabuilder/templates/\n');
console.log('  Next: open any project in Claude Code and run /supabuilder:init\n');
console.log('  Commands:');
console.log('    /supabuilder:init       Initialize workspace + orchestrator');
console.log('    /supabuilder:mission    Start a new mission');
console.log('    /supabuilder:status     Check current state');
console.log('    /supabuilder:settings   Configure cost mode, user control');
console.log('    /sketch                 Excalidraw diagrams');
console.log('    /napkin                 Per-repo mistake tracking');
console.log('  ────────────────────────────────────────────\n');

function copyDirRecursive(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
