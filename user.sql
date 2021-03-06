CREATE TABLE User (
  id INTEGER PRIMARY KEY autoincrement,
  name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Legislators (
  id INTEGER PRIMARY KEY autoincrement,
  name TEXT,
  twitter TEXT,
  party TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Bills (
  id INTEGER PRIMARY KEY autoincrement,
  name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE legsForUser (
  userID INTEGER,
  legsID INTEGER,

  FOREIGN KEY(userID) REFERENCES user(id) ON DELETE CASCADE,
  FOREIGN KEY(legsID) REFERENCES Legislators(id) ON DELETE CASCADE
);

CREATE TABLE billsForUser (
  userID INTEGER,
  billsID INTEGER,

  FOREIGN KEY(userID) REFERENCES user(id) ON DELETE CASCADE,
  FOREIGN KEY(billsID) REFERENCES Bills(id) ON DELETE CASCADE
);