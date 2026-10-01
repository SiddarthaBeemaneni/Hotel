/* =========================================================
   ROOMS API — /api/rooms
   ========================================================= */

const express = require('express');
const router  = express.Router();
const { executeWithRetry } = require('../db');

/* Helper — consistent "DB offline" response */
function dbOffline(res) {
  return res.status(503).json({ success: false, error: 'Database offline. Room data unavailable.' });
}

/* GET /api/rooms — list all rooms */
router.get('/', async (req, res) => {
  try {
    const [rows] = await executeWithRetry('SELECT * FROM rooms ORDER BY room_number');
    res.json({ success: true, data: rows });
  } catch (err) {
    if (err.code === 'ECONNREFUSED' || err.code === 'ER_ACCESS_DENIED_ERROR') return dbOffline(res);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* GET /api/rooms/:id — single room */
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await executeWithRetry(
      'SELECT * FROM rooms WHERE room_id = ?',
      [req.params.id]
    );
    if (!rows || !rows.length) return res.status(404).json({ success: false, error: 'Room not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    if (err.code === 'ECONNREFUSED' || err.code === 'ER_ACCESS_DENIED_ERROR') return dbOffline(res);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* POST /api/rooms — add a room */
router.post('/', async (req, res) => {
  try {
    const { room_number, room_type, floor, rent_amount, status } = req.body;
    if (!room_number || !room_type) {
      return res.status(400).json({ success: false, error: 'room_number and room_type are required.' });
    }
    const [result] = await executeWithRetry(
      `INSERT INTO rooms (room_number, room_type, floor, rent_amount, status)
       VALUES (?, ?, ?, ?, ?)`,
      [room_number, room_type, floor || 1, rent_amount || 0, status || 'vacant']
    );
    res.status(201).json({ success: true, data: { room_id: result.insertId } });
  } catch (err) {
    if (err.code === 'ECONNREFUSED' || err.code === 'ER_ACCESS_DENIED_ERROR') return dbOffline(res);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* PUT /api/rooms/:id — update a room */
router.put('/:id', async (req, res) => {
  try {
    const { room_number, room_type, floor, rent_amount, status } = req.body;
    const [result] = await executeWithRetry(
      `UPDATE rooms SET room_number = ?, room_type = ?, floor = ?, rent_amount = ?, status = ?
       WHERE room_id = ?`,
      [room_number, room_type, floor, rent_amount, status, req.params.id]
    );
    if (!result || !result.affectedRows) return res.status(404).json({ success: false, error: 'Room not found' });
    res.json({ success: true, message: 'Room updated' });
  } catch (err) {
    if (err.code === 'ECONNREFUSED' || err.code === 'ER_ACCESS_DENIED_ERROR') return dbOffline(res);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* DELETE /api/rooms/:id — remove a room */
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await executeWithRetry(
      'DELETE FROM rooms WHERE room_id = ?',
      [req.params.id]
    );
    if (!result || !result.affectedRows) return res.status(404).json({ success: false, error: 'Room not found' });
    res.json({ success: true, message: 'Room deleted' });
  } catch (err) {
    if (err.code === 'ECONNREFUSED' || err.code === 'ER_ACCESS_DENIED_ERROR') return dbOffline(res);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
