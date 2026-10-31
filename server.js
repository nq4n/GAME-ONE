const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DB_FILE = path.join(__dirname, 'data', 'db.json');
const BIBLE_FILE = path.join(__dirname, 'data', 'master_bible.json');

// MIME types dictionary
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=UTF-8'
};

// Database helper functions
function readDb() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json:', err.message);
    return { missions: [], museum_exhibits: [], stories: [], quizzes: [], leaderboard: [], guestbook: [] };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing db.json:', err.message);
    return false;
  }
}

function readBible() {
  try {
    const raw = fs.readFileSync(BIBLE_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading master_bible.json:', err.message);
    return {};
  }
}

// Request helper to parse JSON body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Body payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

// Send JSON response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

// Server creation
const server = http.createServer(async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // API ROUTING
  if (pathname.startsWith('/api/')) {
    try {
      // 1. Health check
      if (pathname === '/api/health' && method === 'GET') {
        return sendJson(res, 200, {
          status: 'online',
          timestamp: new Date().toISOString(),
          uptime: Math.floor(process.uptime()),
          project: 'ECHOES OF SPACE: THE LAST SIGNAL',
          challenge: 'NASA Space Apps Challenge 2026',
          node_version: process.version
        });
      }

      // 2. Overview & Challenge Info
      if (pathname === '/api/overview' && method === 'GET') {
        const bible = readBible();
        const db = readDb();
        return sendJson(res, 200, {
          title: bible.title || 'ECHOES OF SPACE: THE LAST SIGNAL',
          challenge: bible.challenge || {},
          stats: {
            missions_count: db.missions.length,
            exhibits_count: db.museum_exhibits.length,
            stories_count: db.stories.length,
            quizzes_count: db.quizzes.length,
            bible_puzzles_count: (bible.puzzles || []).length,
            scientific_claims_count: (bible.scientific_claims || []).length,
            sources_count: (bible.sources || []).length
          },
          executive_summary: bible.executive_summary || [],
          game_vision: bible.game_vision || []
        });
      }

      // 3. Missions list
      if (pathname === '/api/missions' && method === 'GET') {
        const db = readDb();
        return sendJson(res, 200, db.missions || []);
      }

      // 4. Single mission details
      if (pathname.startsWith('/api/missions/') && method === 'GET') {
        const id = pathname.replace('/api/missions/', '');
        const db = readDb();
        const mission = (db.missions || []).find(m => m.id === id);
        if (mission) {
          return sendJson(res, 200, mission);
        }
        return sendJson(res, 404, { error: 'Mission not found' });
      }

      // 5. Museum exhibits
      if (pathname === '/api/museum' && method === 'GET') {
        const db = readDb();
        return sendJson(res, 200, db.museum_exhibits || []);
      }

      // 6. Stories
      if (pathname === '/api/stories' && method === 'GET') {
        const db = readDb();
        return sendJson(res, 200, db.stories || []);
      }

      // 7. Quizzes
      if (pathname === '/api/quizzes' && method === 'GET') {
        const db = readDb();
        // Omit correct index from public client view for cheating prevention
        const sanitized = (db.quizzes || []).map(q => ({
          id: q.id,
          question_en: q.question_en,
          question_ar: q.question_ar,
          options_en: q.options_en,
          options_ar: q.options_ar,
          xp: q.xp
        }));
        return sendJson(res, 200, sanitized);
      }

      // 8. Quiz submission & verification
      if (pathname === '/api/quizzes/submit' && method === 'POST') {
        const body = await parseBody(req);
        const { questionId, selectedOption, playerName, callsign } = body;
        const db = readDb();
        const q = (db.quizzes || []).find(item => item.id === questionId);
        if (!q) {
          return sendJson(res, 404, { error: 'Question not found' });
        }
        const isCorrect = selectedOption === q.correct;
        const earnedXp = isCorrect ? (q.xp || 100) : 0;

        // If player provided, update or log leaderboard
        if (playerName && isCorrect) {
          let userEntry = db.leaderboard.find(u => u.name.toLowerCase() === playerName.toLowerCase());
          if (userEntry) {
            userEntry.xp = (userEntry.xp || 0) + earnedXp;
            userEntry.date = new Date().toISOString().split('T')[0];
          } else {
            db.leaderboard.push({
              name: playerName,
              callsign: callsign || 'Explorer',
              xp: earnedXp,
              rank: 'Explorer Cadet',
              completed: 'Quiz Challenge',
              date: new Date().toISOString().split('T')[0]
            });
          }
          // Sort leaderboard descending
          db.leaderboard.sort((a, b) => b.xp - a.xp);
          writeDb(db);
        }

        return sendJson(res, 200, {
          isCorrect,
          correctIndex: q.correct,
          explanation_en: q.explanation_en,
          explanation_ar: q.explanation_ar,
          earnedXp
        });
      }

      // 9. Mobility Physics Lab Calculation (SIM01 - SIM04)
      if (pathname === '/api/lab/calculate' && method === 'POST') {
        const body = await parseBody(req);
        const distance_m = Number(body.distance || 1200);
        const rover_speed_kmh = Number(body.speed || 10);
        const budget_min = Number(body.budget || 180);
        const duration_min = Number(body.duration || 25);
        const walking_speed_kmh = 3.0; // Benchmark human walking in lunar regolith

        // Calculation: travel_time (minutes) = (distance_km / speed_kmh) * 60
        const dist_km = distance_m / 1000;
        const walk_travel_min = (dist_km / walking_speed_kmh) * 60;
        const rover_travel_min = (dist_km / rover_speed_kmh) * 60;

        const walk_remaining_min = Math.max(0, budget_min - walk_travel_min);
        const rover_remaining_min = Math.max(0, budget_min - rover_travel_min);

        const walk_stops = Math.floor(walk_remaining_min / duration_min);
        const rover_stops = Math.floor(rover_remaining_min / duration_min);
        const stops_multiplier = walk_stops > 0 ? (rover_stops / walk_stops).toFixed(1) : rover_stops;

        return sendJson(res, 200, {
          distance_m,
          budget_min,
          duration_min,
          walking: {
            speed_kmh: walking_speed_kmh,
            travel_time_min: Number(walk_travel_min.toFixed(1)),
            remaining_time_min: Number(walk_remaining_min.toFixed(1)),
            possible_observation_stops: walk_stops
          },
          rover: {
            speed_kmh: rover_speed_kmh,
            travel_time_min: Number(rover_travel_min.toFixed(1)),
            remaining_time_min: Number(rover_remaining_min.toFixed(1)),
            possible_observation_stops: rover_stops
          },
          gain: {
            saved_time_min: Number((walk_travel_min - rover_travel_min).toFixed(1)),
            additional_stops: rover_stops - walk_stops,
            multiplier: `${stops_multiplier}x`
          },
          scientific_conclusion_en: 'The Lunar Roving Vehicle drastically cut transit times across Hadley plains, multiplying scientific observation opportunities and allowing astronauts to reach geological formations that were otherwise inaccessible within strict life support time budgets.',
          scientific_conclusion_ar: 'قلصت المركبة القمرية زمن الانتقال عبر سهول هادلي، مما ضاعف فرص الملاحظات العلمية وسمح للرواد بالوصول إلى تكوينات جيولوجية بعيدة كان يستحيل بلوغها ضمن حدود أجهزة دعم الحياة.'
        });
      }

      // 10. Leaderboard
      if (pathname === '/api/leaderboard' && method === 'GET') {
        const db = readDb();
        return sendJson(res, 200, db.leaderboard || []);
      }

      if (pathname === '/api/leaderboard' && method === 'POST') {
        const body = await parseBody(req);
        const { name, callsign, xp, completed } = body;
        if (!name) {
          return sendJson(res, 400, { error: 'Name is required' });
        }
        const db = readDb();
        let existing = db.leaderboard.find(u => u.name.toLowerCase() === name.toLowerCase());
        if (existing) {
          existing.xp = Math.max(existing.xp, Number(xp) || 0);
          if (completed) existing.completed = completed;
          existing.date = new Date().toISOString().split('T')[0];
        } else {
          db.leaderboard.push({
            name,
            callsign: callsign || 'Explorer',
            xp: Number(xp) || 100,
            rank: (Number(xp) > 2000) ? 'Master Archive Commander' : (Number(xp) > 1500) ? 'Senior Planetary Surveyor' : 'Planetary Specialist',
            completed: completed || 'Traverse Complete',
            date: new Date().toISOString().split('T')[0]
          });
        }
        db.leaderboard.sort((a, b) => b.xp - a.xp);
        writeDb(db);
        return sendJson(res, 201, { success: true, leaderboard: db.leaderboard });
      }

      // 11. Guestbook / Feedback
      if (pathname === '/api/guestbook' && method === 'GET') {
        const db = readDb();
        return sendJson(res, 200, db.guestbook || []);
      }

      if (pathname === '/api/guestbook' && method === 'POST') {
        const body = await parseBody(req);
        const { name, affiliation, comment } = body;
        if (!name || !comment) {
          return sendJson(res, 400, { error: 'Name and comment are required' });
        }
        const db = readDb();
        const newEntry = {
          name,
          affiliation: affiliation || 'Explorer',
          comment,
          date: new Date().toISOString().split('T')[0]
        };
        db.guestbook.unshift(newEntry);
        writeDb(db);
        return sendJson(res, 201, { success: true, entry: newEntry });
      }

      // 12. Master Game Bible API
      if (pathname === '/api/bible' && method === 'GET') {
        const bible = readBible();
        const section = parsedUrl.query.section;
        if (section && bible[section]) {
          return sendJson(res, 200, { section, data: bible[section] });
        }
        return sendJson(res, 200, bible);
      }

      // API route not recognized
      return sendJson(res, 404, { error: 'API endpoint not found' });
    } catch (apiErr) {
      console.error('API Error:', apiErr);
      return sendJson(res, 500, { error: 'Internal Server Error', message: apiErr.message });
    }
  }

  // STATIC FILE SERVING
  let safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // If not found, serve public/index.html for SPA routing
      const indexPath = path.join(PUBLIC_DIR, 'index.html');
      fs.readFile(indexPath, (readErr, content) => {
        if (readErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          return res.end('404 Not Found');
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 ECHOES OF SPACE: THE LAST SIGNAL Full-Stack Platform`);
  console.log(`📡 Server running at http://localhost:${PORT}`);
  console.log(`🌌 Challenge: NASA Space Apps Challenge 2026`);
  console.log(`=======================================================`);
});
