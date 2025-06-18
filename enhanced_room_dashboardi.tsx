"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
{
  "builds": [
    {
      "src": "vite.config.ts",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}


import React, { useState } from 'react';
import { Clock, User, RefreshCw, Save, ArrowLeft, Plus, Minus, Users, Edit, BookOpen, CheckCircle } from 'lucide-react';

const RoomDashboard = () => {
  const [rooms, setRooms] = useState([
    { id: 1, name: 'Room 1', slots: [] },
    { id: 2, name: 'Room 2', slots: [] },
    { id: 3, name: 'Room 3', slots: [] },
    { id: 4, name: 'Room 4', slots: [] },
    { id: 5, name: 'Room 5', slots: [] },
    { id: 6, name: 'Room 6', slots: [] }
  ]);

  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [cloudData, setCloudData] = useState(null);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [tempRoomName, setTempRoomName] = useState('');

  const courseList = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Literature',
    'History', 'Geography', 'Computer Science', 'Art & Design', 'Music',
    'Physical Education', 'Economics', 'Psychology', 'Sociology', 'Philosophy',
    'Business Studies', 'Accounting', 'Marketing', 'Statistics', 'Engineering'
  ];

  const selectRoom = (room) => {
    setSelectedRoom(room);
    setCurrentPage('room-detail');
  };

  const backToDashboard = () => {
    setCurrentPage('dashboard');
    setSelectedRoom(null);
  };

  const updateRoomSlots = (roomId, newSlots) => {
    setRooms(rooms.map(room => 
      room.id === roomId ? { ...room, slots: newSlots } : room
    ));
  };

  const startEditingRoom = (roomId, currentName) => {
    setEditingRoomId(roomId);
    setTempRoomName(currentName);
  };

  const saveRoomName = (roomId) => {
    if (tempRoomName.trim()) {
      setRooms(rooms.map(room => 
        room.id === roomId ? { ...room, name: tempRoomName.trim() } : room
      ));
    }
    setEditingRoomId(null);
    setTempRoomName('');
  };

  const cancelEditingRoom = () => {
    setEditingRoomId(null);
    setTempRoomName('');
  };

  const saveToCloud = () => {
    const data = {
      timestamp: new Date().toISOString(),
      rooms: rooms
    };
    setCloudData(data);
    alert('Data saved to cloud simulation!');
  };

  const loadFromCloud = () => {
    if (cloudData) {
      setRooms(cloudData.rooms);
      alert('Data loaded from cloud simulation!');
    } else {
      alert('No cloud data available!');
    }
  };

  const getCompletionSummary = () => {
    const totalRooms = rooms.length;
    const roomsWithSlots = rooms.filter(room => room.slots.length > 0).length;
    const fullyAssignedRooms = rooms.filter(room => 
      room.slots.length > 0 && room.slots.every(slot => slot.staffName.trim() !== '' && slot.courseName)
    ).length;
    
    return { totalRooms, roomsWithSlots, fullyAssignedRooms };
  };

  if (currentPage === 'room-detail' && selectedRoom) {
    return (
      <RoomDetailPage
        room={selectedRoom}
        onBack={backToDashboard}
        onUpdateSlots={(newSlots) => updateRoomSlots(selectedRoom.id, newSlots)}
        allRooms={rooms}
        courseList={courseList}
      />
    );
  }

  const { totalRooms, roomsWithSlots, fullyAssignedRooms } = getCompletionSummary();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Room Management Dashboard</h1>
          <p className="text-gray-600 text-sm">Manage rooms with time slots, staff assignments, and course selection</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={saveToCloud}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors text-sm"
            >
              <Save size={16} />
              Save to Cloud
            </button>
            
            <button
              onClick={loadFromCloud}
              className="flex items-center gap-2 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors text-sm"
            >
              <RefreshCw size={16} />
              Load from Cloud
            </button>
            
            {cloudData && (
              <div className="text-xs text-gray-600">
                Last saved: {new Date(cloudData.timestamp).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-lg shadow-lg p-4 border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer transform hover:scale-105"
              onClick={() => !editingRoomId && selectRoom(room)}
            >
              <div className="flex items-center justify-between mb-3">
                {editingRoomId === room.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={tempRoomName}
                      onChange={(e) => setTempRoomName(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-lg font-bold"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        saveRoomName(room.id);
                      }}
                      className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                    >
                      Save
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelEditingRoom();
                      }}
                      className="px-2 py-1 bg-gray-500 text-white rounded text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-gray-800">{room.name}</h3>
                    <Edit 
                      className="text-gray-400 hover:text-blue-500 cursor-pointer" 
                      size={16}
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditingRoom(room.id, room.name);
                      }}
                    />
                  </>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-gray-700 text-sm">Time Slots:</span>
                  <span className="font-bold text-blue-600 text-sm">{room.slots.length}</span>
                </div>
                
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-gray-700 text-sm">Assigned Staff:</span>
                  <span className="font-bold text-green-600 text-sm">
                    {room.slots.filter(slot => slot.staffName && slot.staffName.trim() !== '').length}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-gray-700 text-sm">With Courses:</span>
                  <span className="font-bold text-purple-600 text-sm">
                    {room.slots.filter(slot => slot.courseName).length}
                  </span>
                </div>
                
                {room.slots.length > 0 && (
                  <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                    <div>First: {room.slots[0].startTime} - {room.slots[0].endTime}</div>
                    {room.slots.length > 1 && (
                      <div>Last: {room.slots[room.slots.length - 1].startTime} - {room.slots[room.slots.length - 1].endTime}</div>
                    )}
                  </div>
                )}
              </div>
              
              {!editingRoomId && (
                <div className="mt-3 text-center text-blue-600 font-medium text-sm">
                  Click to manage slots →
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Completion Summary */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <CheckCircle className="text-green-500" size={20} />
            Schedule Completion Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{totalRooms}</div>
              <div className="text-sm text-gray-600">Total Rooms</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-600">{roomsWithSlots}</div>
              <div className="text-sm text-gray-600">Rooms with Slots</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{fullyAssignedRooms}</div>
              <div className="text-sm text-gray-600">Fully Scheduled</div>
            </div>
          </div>
          <div className="mt-3 bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Overall Progress:</span>
              <span className="text-sm font-semibold">
                {totalRooms > 0 ? Math.round((fullyAssignedRooms / totalRooms) * 100) : 0}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${totalRooms > 0 ? (fullyAssignedRooms / totalRooms) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">All Rooms Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Room</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Slots</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Staff</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Courses</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => {
                  const assigned = room.slots.filter(slot => slot.staffName && slot.staffName.trim() !== '').length;
                  const withCourses = room.slots.filter(slot => slot.courseName).length;
                  const fullyComplete = room.slots.length > 0 && room.slots.every(slot => 
                    slot.staffName && slot.staffName.trim() !== '' && slot.courseName
                  );
                  
                  return (
                    <tr key={room.id} className="border-t hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium">{room.name}</td>
                      <td className="px-3 py-2">{room.slots.length}</td>
                      <td className="px-3 py-2 text-green-600">{assigned}</td>
                      <td className="px-3 py-2 text-purple-600">{withCourses}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          room.slots.length === 0 ? 'bg-gray-200 text-gray-700' :
                          fullyComplete ? 'bg-green-200 text-green-800' :
                          assigned > 0 || withCourses > 0 ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'
                        }`}>
                          {room.slots.length === 0 ? 'Not Setup' :
                           fullyComplete ? 'Complete' :
                           assigned > 0 || withCourses > 0 ? 'In Progress' : 'Not Started'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3x3 Room Schedule Grid */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4">All Rooms Schedule - 3x3 Grid View</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <div key={room.id} className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                <h3 className="font-bold text-center text-purple-700 mb-3 text-sm bg-white py-2 rounded">
                  {room.name}
                </h3>
                
                {room.slots.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {room.slots.map((slot) => (
                      <div key={slot.id} className="bg-white p-2 rounded border text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="font-semibold text-blue-600">Slot {slot.slotNumber}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-gray-600">{slot.startTime}-{slot.endTime}</span>
                          </div>
                        </div>
                        
                        <div className="mt-1">
                          <div className="flex items-center gap-1 mb-1">
                            <User size={10} className="text-gray-500" />
                            <span className="text-green-700 font-medium">
                              {slot.staffName && slot.staffName.trim() !== '' ? slot.staffName : 'No Staff'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <BookOpen size={10} className="text-gray-500" />
                            <span className="text-purple-700 font-medium">
                              {slot.courseName || 'No Course'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8 text-xs">
                    No slots created yet
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const RoomDetailPage = ({ room, onBack, onUpdateSlots, allRooms, courseList }) => {
  const [slots, setSlots] = useState(room.slots || []);
  const [slotCount, setSlotCount] = useState(room.slots?.length || 1);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [autoFillStart, setAutoFillStart] = useState('09:00');
  const [autoFillEnd, setAutoFillEnd] = useState('17:00');
  const [slotDuration, setSlotDuration] = useState(60);

  const generateTimeSlots = () => {
    const newSlots = [];
    const startTime = new Date(`2000-01-01T${autoFillStart}`);
    const endTime = new Date(`2000-01-01T${autoFillEnd}`);
    const totalMinutes = (endTime - startTime) / (1000 * 60);
    const actualSlotCount = Math.min(slotCount, Math.floor(totalMinutes / slotDuration));
    
    for (let i = 0; i < actualSlotCount; i++) {
      const slotStart = new Date(startTime.getTime() + (i * slotDuration * 60 * 1000));
      const slotEnd = new Date(slotStart.getTime() + (slotDuration * 60 * 1000));
      
      const existingSlot = slots[i];
      newSlots.push({
        id: existingSlot?.id || Date.now() + i,
        slotNumber: i + 1,
        staffName: existingSlot?.staffName || '',
        courseName: existingSlot?.courseName || '',
        startTime: slotStart.toTimeString().slice(0, 5),
        endTime: slotEnd.toTimeString().slice(0, 5)
      });
    }
    
    for (let i = actualSlotCount; i < slotCount; i++) {
      const existingSlot = slots[i];
      newSlots.push({
        id: existingSlot?.id || Date.now() + i,
        slotNumber: i + 1,
        staffName: existingSlot?.staffName || '',
        courseName: existingSlot?.courseName || '',
        startTime: existingSlot?.startTime || '09:00',
        endTime: existingSlot?.endTime || '10:00'
      });
    }
    
    setSlots(newSlots);
  };

  const updateSlot = (slotId, field, value) => {
    setSlots(slots.map(slot => 
      slot.id === slotId ? { ...slot, [field]: value } : slot
    ));
  };

  const toggleSlotSelection = (slotId) => {
    setSelectedSlots(prev => {
      if (prev.includes(slotId)) {
        return prev.filter(id => id !== slotId);
      } else if (prev.length < 2) {
        return [...prev, slotId];
      } else {
        return [prev[1], slotId];
      }
    });
  };

  const swapSelectedSlots = () => {
    if (selectedSlots.length === 2) {
      const [slot1Id, slot2Id] = selectedSlots;
      const slot1 = slots.find(s => s.id === slot1Id);
      const slot2 = slots.find(s => s.id === slot2Id);
      
      setSlots(slots.map(slot => {
        if (slot.id === slot1Id) {
          return { ...slot, staffName: slot2.staffName, courseName: slot2.courseName };
        } else if (slot.id === slot2Id) {
          return { ...slot, staffName: slot1.staffName, courseName: slot1.courseName };
        }
        return slot;
      }));
      
      setSelectedSlots([]);
    }
  };

  const saveSlots = () => {
    onUpdateSlots(slots);
    alert('Slots saved successfully!');
  };

  const clearAllSlots = () => {
    if (window.confirm('Are you sure you want to clear all staff names and courses?')) {
      setSlots(slots.map(slot => ({ ...slot, staffName: '', courseName: '' })));
    }
  };

  const assignedCount = slots.filter(s => s.staffName && s.staffName.trim() !== '').length;
  const courseCount = slots.filter(s => s.courseName).length;
  const fullyComplete = slots.length > 0 && slots.every(slot => 
    slot.staffName && slot.staffName.trim() !== '' && slot.courseName
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors text-sm"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-800">{room.name} - Slot Management</h1>
            {fullyComplete && <CheckCircle className="text-green-500" size={24} />}
          </div>
          <p className="text-gray-600 text-sm">Manage time slots with staff assignments and course selection</p>
        </div>

        {/* Slot Configuration */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Slot Configuration</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Slots (1-100)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={slotCount}
                onChange={(e) => setSlotCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                value={autoFillStart}
                onChange={(e) => setAutoFillStart(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                value={autoFillEnd}
                onChange={(e) => setAutoFillEnd(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Duration</label>
              <select
                value={slotDuration}
                onChange={(e) => setSlotDuration(parseInt(e.target.value))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={15}>15min</option>
                <option value={30}>30min</option>
                <option value={45}>45min</option>
                <option value={60}>1hr</option>
                <option value={90}>1.5hr</option>
                <option value={120}>2hr</option>
              </select>
            </div>
          </div>
          <button
            onClick={generateTimeSlots}
            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg font-semibold transition-colors text-sm"
          >
            Generate Slots
          </button>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={swapSelectedSlots}
              disabled={selectedSlots.length !== 2}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-colors text-sm ${
                selectedSlots.length === 2
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <RefreshCw size={16} />
              Swap ({selectedSlots.length}/2)
            </button>
            
            <button
              onClick={saveSlots}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors text-sm"
            >
              <Save size={16} />
              Save Slots
            </button>
            
            <button
              onClick={clearAllSlots}
              className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors text-sm"
            >
              <RefreshCw size={16} />
              Clear All
            </button>
            
            <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
              Slots: {slots.length} | Staff: {assignedCount} | Courses: {courseCount}
              {fullyComplete && <span className="text-green-600 ml-2">✓ Complete</span>}
            </div>
          </div>
        </div>

        {/* Slots Grid */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Time Slots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className={`border-2 rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                  selectedSlots.includes(slot.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-purple-300 bg-white'
                }`}
                onClick={() => toggleSlotSelection(slot.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-purple-600 text-sm">Slot {slot.slotNumber}</span>
                  {selectedSlots.includes(slot.id) && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <User className="text-gray-500" size={12} />
                    <input
                      type="text"
                      value={slot.staffName || ''}
                      onChange={(e) => updateSlot(slot.id, 'staffName', e.target.value)}
                      placeholder="Staff name"
                      className="flex-1 px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <BookOpen className="text-gray-500" size={12} />
                    <input
                      type="text"
                      value={slot.courseName || ''}
                      onChange={(e) => updateSlot(slot.id, 'courseName', e.target.value)}
                      placeholder="Course name"
                      list={`courses-${slot.id}`}
                      className="flex-1 px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <datalist id={`courses-${slot.id}`}>
                      {courseList.map((course) => (
                        <option key={course} value={course} />
                      ))}
                    </datalist>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Clock className="text-gray-500" size={12} />
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateSlot(slot.id, 'startTime', e.target.value)}
                      className="px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="text-xs text-gray-500">-</span>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateSlot(slot.id, 'endTime', e.target.value)}
                      className="px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {slots.length === 0 && (
            <div className="text-center text-gray-500 py-8 text-sm">
              No slots created yet. Use the configuration panel above to generate time slots.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDashboard;
