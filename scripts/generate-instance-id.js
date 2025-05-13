const { writeFileSync, existsSync, readFileSync } = require('fs');
const { resolve } = require('path');
const { randomUUID } = require('crypto');

const instancePath = resolve(__dirname, '../.instance-id');
const envPath = resolve(__dirname, '../.env');

let shouldGenerate = true;

if (existsSync(instancePath)) {
  const content = readFileSync(instancePath, 'utf-8').trim();
  if (content && content !== 'none') {
    console.log('ℹ️ .instance-id already exists and is valid. Skipping generation.');
    shouldGenerate = false;
  } else {
    console.log('⚠️ .instance-id exists but is invalid (empty or "none"). Regenerating...');
  }
}

if (shouldGenerate) {
  const id = randomUUID();
  writeFileSync(instancePath, id, 'utf-8');
  console.log(`✅ .instance-id generated: ${id}`);

  let currentEnv = '';
  if (existsSync(envPath)) {
    currentEnv = readFileSync(envPath, 'utf-8');
    if (currentEnv.includes('NEXT_PUBLIC_INSTANCE_ID=')) {
      console.log('ℹ️ NEXT_PUBLIC_INSTANCE_ID is already defined in .env. Skipping update.');
      return;
    }
  }

  writeFileSync(envPath, `${currentEnv}\nNEXT_PUBLIC_INSTANCE_ID=${id}\n`, { flag: 'w' });
  console.log('✅ NEXT_PUBLIC_INSTANCE_ID added to .env');
}
