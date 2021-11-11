#!/usr/bin/env node

/*
 * Copyright 2021 Dimitrios-Georgios Akestoridis
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { spawn, spawnSync } = require('child_process');
const prompts = require('prompts');

(async () => {
  try {
    let configFile = null;
    const args = process.argv.slice(2);
    if (args.length === 1) {
      // eslint-disable-next-line prefer-destructuring
      configFile = args[0];
      if (!fs.existsSync(configFile)) {
        throw new Error('The provided path does not exist');
      }
    } else if (args.length !== 0) {
      throw new Error('Invalid number of arguments');
    }

    const serversResponse = await prompts({
      type: 'multiselect',
      name: 'servers',
      message: 'Which servers would you like to launch?',
      choices: [
        { title: 'Web', value: 'Web', selected: true },
        { title: 'Inspection', value: 'Inspection', selected: true },
        { title: 'Aggregation', value: 'Aggregation', selected: true },
        { title: 'Retention', value: 'Retention', selected: true },
      ],
      instructions: false,
      hint: 'Tab to navigate. Space to select/unselect. Enter to submit.',
    });

    if (serversResponse.servers.includes('Inspection')
        || serversResponse.servers.includes('Aggregation')) {
      if (!process.env.DB_NAME) {
        const dbNameResponse = await prompts({
          type: 'text',
          name: 'dbName',
          message: 'What is the name of the database?',
        });
        process.env.DB_NAME = dbNameResponse.dbName;
      }

      if (!process.env.DB_USER) {
        const dbUserResponse = await prompts({
          type: 'text',
          name: 'dbUser',
          message: 'What is the database username?',
        });
        process.env.DB_USER = dbUserResponse.dbUser;
      }

      if (!process.env.DB_PASS) {
        const dbPassResponse = await prompts({
          type: 'password',
          name: 'dbPass',
          message: 'What is the database password?',
        });
        process.env.DB_PASS = dbPassResponse.dbPass;
      }

      const dbInitArgs = [
        path.join(
          __dirname,
          'node_modules',
          'hiveguard-backend',
          'db.init.js',
        ),
      ];

      if (configFile) {
        dbInitArgs.push(configFile);
      }

      const cp = spawnSync('node', dbInitArgs);
      if (cp.status === 0) {
        console.log('Initialized the database successfully');
      } else {
        console.error(cp.stderr.toString());
        throw new Error('Failed to initialize the database');
      }
    }

    if (serversResponse.servers.includes('Inspection')) {
      if (!process.env.EMAIL_SNDR_HOST) {
        const emailSndrHostResponse = await prompts({
          type: 'text',
          name: 'emailSndrHost',
          message: 'What is the sender\'s email host?',
        });
        process.env.EMAIL_SNDR_HOST = emailSndrHostResponse.emailSndrHost;
      }

      if (!process.env.EMAIL_SNDR_PORT) {
        const emailSndrPortResponse = await prompts({
          type: 'number',
          name: 'emailSndrPort',
          message: 'What is the sender\'s email port number?',
        });
        process.env.EMAIL_SNDR_PORT = emailSndrPortResponse.emailSndrPort;
      }

      if (!process.env.EMAIL_SNDR_ADDR) {
        const emailSndrAddrResponse = await prompts({
          type: 'text',
          name: 'emailSndrAddr',
          message: 'What is the sender\'s email address?',
        });
        process.env.EMAIL_SNDR_ADDR = emailSndrAddrResponse.emailSndrAddr;
      }

      if (!process.env.EMAIL_SNDR_PASS) {
        const emailSndrPassResponse = await prompts({
          type: 'password',
          name: 'emailSndrPass',
          message: 'What is the sender\'s email password?',
        });
        process.env.EMAIL_SNDR_PASS = emailSndrPassResponse.emailSndrPass;
      }

      if (!process.env.EMAIL_RCVR_ADDR) {
        const emailRcvrAddrResponse = await prompts({
          type: 'text',
          name: 'emailRcvrAddr',
          message: 'What is the receiver\'s email address?',
        });
        process.env.EMAIL_RCVR_ADDR = emailRcvrAddrResponse.emailRcvrAddr;
      }
    }

    if (serversResponse.servers.includes('Web')) {
      const webArgs = [
        path.join(__dirname, 'node_modules', '.bin', 'hiveguard-web'),
        path.join(__dirname, 'node_modules', 'hiveguard-frontend', 'dist'),
        'index.html',
      ];

      if (configFile) {
        webArgs.push(configFile);
      }

      const webProcess = spawn('node', webArgs);

      webProcess.stdout.on('data', (data) => {
        console.log(`[WebServer stdout] ${data}`);
      });

      webProcess.stderr.on('data', (data) => {
        console.error(`[WebServer stderr] ${data}`);
      });

      webProcess.on('close', (code) => {
        console.log(`The web process exited with code ${code}`);
      });
    }

    if (serversResponse.servers.includes('Inspection')) {
      const inspectionArgs = [
        path.join(__dirname, 'node_modules', '.bin', 'hiveguard-inspection'),
      ];

      if (configFile) {
        inspectionArgs.push(configFile);
      }

      const inspectionProcess = spawn('node', inspectionArgs);

      inspectionProcess.stdout.on('data', (data) => {
        console.log(`[InspectionServer stdout] ${data}`);
      });

      inspectionProcess.stderr.on('data', (data) => {
        console.error(`[InspectionServer stderr] ${data}`);
      });

      inspectionProcess.on('close', (code) => {
        console.log(`The inspection process exited with code ${code}`);
      });
    }

    if (serversResponse.servers.includes('Aggregation')) {
      const aggregationArgs = [
        path.join(__dirname, 'node_modules', '.bin', 'hiveguard-aggregation'),
      ];

      if (configFile) {
        aggregationArgs.push(configFile);
      }

      const aggregationProcess = spawn('node', aggregationArgs);

      aggregationProcess.stdout.on('data', (data) => {
        console.log(`[AggregationServer stdout] ${data}`);
      });

      aggregationProcess.stderr.on('data', (data) => {
        console.error(`[AggregationServer stderr] ${data}`);
      });

      aggregationProcess.on('close', (code) => {
        console.log(`The aggregation process exited with code ${code}`);
      });
    }

    if (serversResponse.servers.includes('Retention')) {
      const retentionArgs = [
        path.join(__dirname, 'node_modules', '.bin', 'hiveguard-retention'),
      ];

      if (configFile) {
        retentionArgs.push(configFile);
      }

      const retentionProcess = spawn('node', retentionArgs);

      retentionProcess.stdout.on('data', (data) => {
        console.log(`[RetentionServer stdout] ${data}`);
      });

      retentionProcess.stderr.on('data', (data) => {
        console.error(`[RetentionServer stderr] ${data}`);
      });

      retentionProcess.on('close', (code) => {
        console.log(`The retention process exited with code ${code}`);
      });
    }
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
})();
