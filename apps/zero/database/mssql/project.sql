-- create database
CREATE DATABASE "nibls-mssql-database-0";
GO

USE "nibls-mssql-database-0";
GO

CREATE SCHEMA Events
    AUTHORIZATION dbo;
GO

CREATE SCHEMA Teams
    AUTHORIZATION dbo;
GO

-- create niblsball tables
USE "nibls-mssql-database-0";
GO

CREATE TABLE Teams.TechPlusBall(
  teamID int IDENTITY (1,1) NOT NULL PRIMARY KEY,
  name nvarchar(200) NOT NULL
)

CREATE TABLE Events.Niblsballevents (
 eventID int IDENTITY (1,1) NOT NULL PRIMARY KEY,
 hometeamID int NOT NULL
  CONSTRAINT FK_Niblsballevents_hometeamId_Niblsballteams_teamID
    REFERENCES Teams.TechPlusBall(teamID),
 awayteamID int NOT NULL
  CONSTRAINT FK_Niblsballevents_awayteamId_Niblsballteams_teamID
    REFERENCES Teams.TechPlusBall(teamID),
  matchTime datetimeoffset(0), -- late to be converted to datetimeoffset(0)
  spreadFor  decimal(4,2) NOT NULL,
  spreadAgainst decimal(4,2) NOT NULL,
  CONSTRAINT CK_EventsNiblsballevents_home_away_are_different CHECK (hometeamID <> awayteamID)
)

GO



-- sample teams

INSERT INTO Teams.TechPlusBall(
  name
)
VALUES
  ('Killer Scorpions'),
  ('Heroic Bullets'),
  ('Alphas'),
  ('AR-15''z'),
  ('Bear-catz'),
  ('Dragon Warriors'),
  ('United Diplomats'),
  ('Las Vegas Sunsets'),
  ('Lions'),
  ('Pirates'),
  ('Royals'),
  ('Triple Assains'),
  ('Wave Gods')



-- create view
CREATE VIEW Events.VW_Event_Match_Info
WITH SCHEMABINDING
AS
  SELECT
    ev.matchTime,
    ev.spreadFor,
    ev.spreadAgainst,
    ht.name AS homeTeam,
    awt.name AS awayTeam
  FROM Events.Niblsballevents ev
    INNER JOIN Teams.TechPlusBall ht
      ON ev.hometeamID = ht.teamID
    INNER JOIN Teams.TechPlusBall awt
      ON ev.awayteamID = awt.teamID









-- misc statements
SELECT * FROM Events.VW_Event_Match_Info
ORDER BY matchTime
DROP TABLE Events.Niblsballevents
SELECT * FROM Events.Niblsballevents
DROP TABLE Events.Niblsballevents
DROP VIEW Events.VW_Event_Match_Info

SELECT CONVERT(datetimeoffset(0), '2pm 20 Dec 2018') AS Result;
SELECT * FROM Teams.TechPlusBall
DROP DATABASE niblscoin;



USE "nibls-mssql-database-0";
GO

SELECT * FROM Teams.TechPlusBall;
GO
