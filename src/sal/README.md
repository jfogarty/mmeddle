# Service Abstraction Layer

SAL provides the plugin based services layer for mMeddle workspaces.  
The primary services provided are a storage stack and a user representation.

## Q Promises

All storage and communications in mmeddle are based on **Q** promises. These are
are fundamental to everything that happens in mmeddle so its a good idea to get
familiar with this as quickly as possible.

## Storage

Storage is used to save mMeddle workspaces, documents, user information,
configurations, etc.  The model used is a simple one based on MongoDB 
collections of JSON objects.

Storage engines and clients run only on **node**, so all client access is
through the socket.io based Workspace/Client sessions. 

In this abstraction, storage is a flat set of collections. Every object in
every collection contains `name` and `owner` fields.  The object type is 
the collection name.

The objects in each collection are indexed by their `name` field, but are
otherwise simple JSON representations of the objects used in the application.

The [owner] is always either a group name, or the owner of a the objects in the collection.

### StorageClient

Applications access storage through lightweight `StorageCient` objects.
The client specifies the default owner for objects, and does any front
end handling of the objects before passing them on to the storage engine.

The operations available from the clients are:
    
- store: store an object by type, name and owner
- load: load an object by type, name and owner
- remove: delete an objects by type, owner, and name
- loadMultiple: load multiple objects by type, owner, and name filter

An application may have many storage clients at any given time. The
mMeddle server currently has 3 for each open workspace, although this
is subject to change.

### StorageEngine

The storage engine sequences operations to the database and file storage
providers and does work common to both. There is usually only one storage
engine per application.

The providers are registered to the storage engine after it is created.
Each provider must implement all methods corresponding to the client
operations.

### Database Storage

Database storage is provided by the **MongoDBProvider**. When it is
registered to the storage engine, and the database specfied by the constructor
URL is available, most (if not all) storage operations will use it.
The database connection is closed automatically after a two minute timeout
(`EggTimer`) which is reset by any file activity.

### FileSystem Storage

The **FileProvider** separates objects into a filesystem hierarchy of
files of the format: **./storage/[owner]/[collection]/[name].mm.json**.
The FileSystem is only used by the storage engine if the Path contains
a `prefer: 'fs'` field, or the database provider is unavailable.

### Proxies

** THIS IS NOT YET IMPLEMENTED **.
Documents may also have one or more levels of indirection as indicated by storage in a collection of a proxy for the actual object. These look like:

```javascript
    {
        name: "name of the object being proxied",
        mmType: "type of object (and part of the collection name)",
        proxy: true,
        owner: "actual owner of the object"
    }
```

When storage fetches an object that it resolves as a proxy, it transparently loads the
next object in the proxy chain until a concrete object is found.

## Users

Users are mmeddle's way of keeping everyone from stomping on each others toes. Users
also participate in the Settings hierarchy.  The `ClientUser` is the persistent
object that represents a user. **ClientUser**s are passed freely to browser
clients over Workspace sockets connections.

Public and Private versions of each ClientUser is kept in **userAdmin**
storage. The Private version contains the password hash, while the public
version should be accessible to anyone.

### Passwords, SHA256, and pbkdf2

mMeddle has a reasonably simple but ultimtely insecure user model.
This is by design (and because I am both pragmatic and lazy).

User names (i.e. aliases) must be unique for the entire site.
To enforce this, each user (the person) must select a password
to establish their unique identity, and to avoid accidental logins
from one person to access another person's stuff.

Passwords are never saved directly by mMeddle, but since the client
code is JavaScript running on a browser, there is always a weak spot
where hacker access to the client browser can compromise the whole
system. When a user is created the first time, or when a password is
changed, the plain text of the password is converted into a PBKDF2
(Password Based Key Derived Function 2) hash. We use a 1000 pass 
[PBKDF2](http://en.wikipedia.org/wiki/PBKDF2) cipher to produce the hash.
This hash is significantly more resistent to attacks than a simple SHA or
MD5 hash. The plain text is deleted at that point, and as long as the
user uses the same browser, there is no need to reenter a text password.

Since the plain text is never sent to the server or stored in a database,
the user's other accounts (for which he has selected the same password or
a simple variant on it) do not become more vulnerable from here.

The PBK hash is now the actual password and it is saved as a hex string
in the browser local storage user. The more paranoid may want to remove
these, but in truth the reentry of the plain text password on every login
creates a much bigger threat window. If the browser is compromised the
user is compromised, there is no middle ground.

The PBK is sent to the server for saving during create User and change
password request handling. Logins do not sent the PBK itself, instead
they send a SHA256 hash of the PBK seeded by the random socket.io 
connection id for session. Since this changes on every connection, the
PBK is that much less vulnerable to packet sniffers.

Finally, the PBK itself is seeded by the creation time for the user so
multiple users who select the same password, do not end up with the same PBK.
 
All that sounds like I've made some effort to be secure, but don't be
fooled. mMeddle is not designed for security and privacy. It is about
sharing content, not restricting its access. I don't expect to 'harden'
the security in the future, as there is little call for it in this kind
of site. On the other hand, adding third party authentication may prove
to be a temptation too great to resist, since they do offer user 
conveniences (and greater security).

##.

