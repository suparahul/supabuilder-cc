#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const HOME = process.env.HOME || process.env.USERPROFILE;
const CLAUDE_DIR = path.join(HOME, '.claude');
const AGENTS_DIR = path.join(CLAUDE_DIR, 'agents');
const SKILLS_DIR = path.join(CLAUDE_DIR, 'skills');

const SRC_AGENTS = path.join(__dirname, 'agents');
const SRC_SKILLS = path.join(__dirname, 'skills');

// Handle --uninstall flag
if (process.argv.includes('--uninstall')) {
  console.log('\n  Supabuilder Uninstaller\n');

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
    // Restore backup if one exists
    if (fs.existsSync(backup)) {
      fs.renameSync(backup, dest);
      console.log(`    Restored backup of ${agent}`);
    }
  }
  console.log(`    ${removed} agents removed\n`);

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

  console.log('  ────────────────────────────────────────────');
  console.log('  Supabuilder uninstalled.\n');
  console.log('  Backup agent files were restored where available.');
  console.log('  ────────────────────────────────────────────\n');
  process.exit(0);
}

console.log('\n  Supabuilder Installer\n');

// Step 1: Ensure ~/.claude exists
if (!fs.existsSync(CLAUDE_DIR)) {
  console.log('  Creating ~/.claude/ ...');
  fs.mkdirSync(CLAUDE_DIR, { recursive: true });
}

// Step 2: Install agents
console.log('  Installing agents...');
if (!fs.existsSync(AGENTS_DIR)) {
  fs.mkdirSync(AGENTS_DIR, { recursive: true });
}

const agents = fs.readdirSync(SRC_AGENTS).filter(f => f.endsWith('.md'));
let agentCount = 0;
for (const agent of agents) {
  const src = path.join(SRC_AGENTS, agent);
  const dest = path.join(AGENTS_DIR, agent);
  if (fs.existsSync(dest)) {
    // Back up existing file
    const backup = dest + '.backup';
    fs.copyFileSync(dest, backup);
    console.log(`    Backed up existing ${agent}`);
  }
  fs.copyFileSync(src, dest);
  agentCount++;
}
console.log(`    ${agentCount} agents installed\n`);

// Step 3: Install skills
console.log('  Installing skills...');
if (!fs.existsSync(SKILLS_DIR)) {
  fs.mkdirSync(SKILLS_DIR, { recursive: true });
}

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

// Done
console.log('  ────────────────────────────────────────────');
console.log('  Supabuilder installed!\n');
console.log('  Agents: ~/.claude/agents/');
console.log('  Skills: ~/.claude/skills/\n');
console.log('  Next steps:');
console.log('    1. Open any project in Claude Code');
console.log('    2. Run: /supabuilder:init');
console.log('    3. Run: /supabuilder:start\n');
console.log('  All commands:');
console.log('    /supabuilder:init       Scan project, create context');
console.log('    /supabuilder:start      Guided product ideation');
console.log('    /supabuilder:sprint     Full team sprint');
console.log('    /supabuilder:develop    Build from tickets (dev waves + QA)');
console.log('    /supabuilder:review     Dev + QA review');
console.log('    /supabuilder:status     Sprint progress');
console.log('    /supabuilder:mode       Cost & debate settings');
console.log('    /sketch                 Excalidraw diagrams');
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
