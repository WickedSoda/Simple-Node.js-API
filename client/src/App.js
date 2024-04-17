import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

function GenerateToken() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleGenerateToken = async () => {
    try {
      const response = await fetch('http://localhost:5000/users/token', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to generate token');
      }
      const { token } = await response.json();
      setToken(token);
      localStorage.setItem('token', token);
    } catch (error) {
      console.error('Error generating token:', error);
    }
  };

  return (
    <div className="App">
      <h1>Generate Token</h1>
      <div className="token-container">
        <input type="text" value={token} readOnly />
      </div>
      <div className="buttons-container">
        <button onClick={handleGenerateToken}>Generate Token</button>
        <Link to="/actions"><button>Next</button></Link>
      </div>
    </div>
  );
}

function Actions() {
  const [userList, setUserList] = useState('');
  const [token] = useState(localStorage.getItem('token') || '');
  const [action, setAction] = useState('');
  const [userId, setUserId] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [createData, setCreateData] = useState({ name: '', email: '', password: '' });
  const [createMessage, setCreateMessage] = useState('');
  const [updateData, setUpdateData] = useState({ name: '', email: '', password: '' });
  const [updateMessage, setUpdateMessage] = useState('');
  const [verifyMessage, setVerifyMessage] = useState('');
  const [verifyClicked, setVerifyClicked] = useState(false);

  const handleActionSubmit = async (selectedAction) => {
    switch (selectedAction) {
      case 'seeAll':
        try {
          const response = await fetch('http://localhost:5000/users', {
            headers: {
              'Authorization': `${token}`
            }
          });
          if (!response.ok) {
            throw new Error('Failed to fetch users');
          }
          const data = await response.json();
          setUserList(data);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
        break;
      case 'verify':
        try {
          const response = await fetch(`http://localhost:5000/users/${userId}`, {
            method: 'GET',
            headers: {
              'Authorization': `${token}`
            }
          });
          if (!response.ok) {
            throw new Error('Failed to verify user');
          }
          const { user } = await response.json();
          setUserList([user]);
          setVerifyMessage('User verified successfully');
        } catch (error) {
          console.error('Error verifying user:', error);
          setVerifyMessage(error.message);
        }
        break;
      case 'delete':
        try {
          const response = await fetch(`http://localhost:5000/users/${userId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `${token}`
            }
          });
          if (!response.ok) {
            throw new Error('Failed to delete user');
          }
          setDeleteMessage('User has been deleted');
        } catch (error) {
          console.error('Error deleting user:', error);
          setDeleteMessage(error.message);
        }
        break;
      case 'create':
        try {
          const { name, email, password } = createData;
          const userData = { name, email, password };
          const response = await fetch('http://localhost:5000/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `${token}`
            },
            body: JSON.stringify(userData)
          });
          if (!response.ok) {
            throw new Error('Failed to create user');
          }
          setCreateMessage('User has been created successfully');
        } catch (error) {
          console.error('Error creating user:', error);
          setCreateMessage(error.message);
        }
        break;
      case 'update':
        try {
          const { name, email, password } = updateData;
          const userData = { name, email, password };
          const response = await fetch(`http://localhost:5000/users/${userId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `${token}`
            },
            body: JSON.stringify(userData)
          });
          if (!response.ok) {
            throw new Error('Failed to update user');
          }
          setUpdateMessage('User has been updated successfully');
        } catch (error) {
          console.error('Error updating user:', error);
          setUpdateMessage(error.message);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="App">
      <div className='sideBar'>
        <h1>ACTIONS</h1>
        <div className="actions">
          <button onClick={() => setAction('create')}>Create User</button>
          <button onClick={() => setAction('seeAll')}>See All Users</button>
          <button onClick={() => setAction('verify')}>Verify User</button>
          <button onClick={() => setAction('update')}>Update User</button>
          <button onClick={() => setAction('delete')}>Delete User</button>
        </div>
        <div className='back'>
          <Link to="/"><button>Back to Token Generation</button></Link>
        </div>
      </div>
      <div className='mainPanel'>
        {action === 'seeAll' && userList.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Deleted</th>
              </tr>
            </thead>
            <tbody>
              {userList.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td>
                  <td>{user.deleted ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {action === 'seeAll' && userList.length === 0 && <p>No users found</p>}
        {action === 'create' && (
          <div className="create">
            <input type="text" placeholder="Name" value={createData.name} onChange={(e) => setCreateData({ ...createData, name: e.target.value })} />
            <input type="email" placeholder="Email" value={createData.email} onChange={(e) => setCreateData({ ...createData, email: e.target.value })} />
            <input type="password" placeholder="Password" value={createData.password} onChange={(e) => setCreateData({ ...createData, password: e.target.value })} />
            <button onClick={() => handleActionSubmit('create')}>CREATE</button>
            {createMessage && <p>{createMessage}</p>}
          </div>
        )}
        {action === 'verify' && !verifyClicked && (
          <div>
            <input type="text" placeholder="Email" value={userId} onChange={(e) => setUserId(e.target.value)} />
            <button onClick={() => { handleActionSubmit('verify'); setVerifyClicked(true); }}>VERIFY</button>
          </div>
        )}
        {action === 'verify' && verifyClicked && (
          <div>
            <input type="text" placeholder="Email" value={userId} onChange={(e) => setUserId(e.target.value)} />
            <button onClick={() => { handleActionSubmit('verify'); setVerifyClicked(true); }}>VERIFY</button>
            {userList.length > 0 && userList[0] ? (
              <div>
                <p>Name: {userList[0].name}</p>
                <p>Email: {userList[0].email}</p>
              </div>
            ) : (
              <p>No user found</p>
            )}
            {verifyMessage && <p>{verifyMessage}</p>}
          </div>
        )}
        {action === 'delete' && (
          <div>
            <input type="text" placeholder="Email" value={userId} onChange={(e) => setUserId(e.target.value)} />
            <button onClick={() => handleActionSubmit('delete')}>DELETE</button>
            {deleteMessage && <p>{deleteMessage}</p>}
          </div>
        )}
        {action === 'update' && (
          <div>
            <input type="text" placeholder="Email" value={userId} onChange={(e) => setUserId(e.target.value)} />
            <input type="text" placeholder="Name" value={updateData.name} onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })} />
            <input type="email" placeholder="Email" value={updateData.email} onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })} />
            <input type="password" placeholder="Password" value={updateData.password} onChange={(e) => setUpdateData({ ...updateData, password: e.target.value })} />
            <button onClick={() => handleActionSubmit('update')}>UPDATE</button>
            {updateMessage && <p>{updateMessage}</p>}
          </div>
        )}
      </div>
    </div>
  );
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GenerateToken />} />
        <Route path="/actions" element={<Actions />} />
      </Routes>
    </Router>
  );
}

export default App;
