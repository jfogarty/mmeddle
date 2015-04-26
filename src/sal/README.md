# mMeddle Service Abstraction Layer

SAL provides the plugin based services layer for mmeddle workspaces.  The primary services
provided are a storage stack and a user representation.

## Q and q-io


All storage and communications in mmeddle are based on **Q** promises. These are
are fundamental to everything that happens in mmeddle so its a good idea to get
familiar with this as quickly as possible.

All node.js file IO uses **q-io**, although the database IO uses a `SequencedObject`
wrapper around the **mongod** MondoDB node.js driver.


## Storage

Storage is used to save mMeddle workspaces, documents, user information, configutaions, etc.  The model used is a simple one based on MongoDB collections of JSON objects. It is implemented via a set of storage plugins covering the following use cases:

- the base case is mock storage for use in testing
- browser local storage supports in-browser use while unconnected from a server
- fileSystem storage is used by servers outside of a database
- database storage uses a mongoDB database 
- client storage connects browsers to a mmeddle server

In this abstraction, storage is a flat set of collections.
Collection names consist of `[userName]/[objectType]` pairs.
The objects in each collection are indexed by their `name` field,
but are otherwise simple JSON representations of the objects used in the application.

The [userName] is always either a group name, or the owner of a the objects in the collection.

### Proxies

Documents may also have one or more levels of indirection as indicated by storage in a collection of a proxy for the actual object. These look like:

```javascript
    {
        name: "name of the object being proxied",
        mmType: "type of object (and part of the collection name)",
        proxy: true,
        userName: "actual owner of the object"
    }
```

When storage fetches an object that it resolves as a proxy, it transparently loads the
next object in the proxy chain until a concrete object is found.

## Users

Users are mmeddle's way of keeping everyone from stomping on each others toes. Users
also participate in the Settings hierarchy.

### Passwords, SHA256, and pbkdf2

The default mode for password management uses a 1000 pass 
[PBKDF2](http://en.wikipedia.org/wiki/PBKDF2) cipher to produce the hash.
This is only a bit more secure than a simple hash although it takes a lot longer
to compute. The slowness makes it a more difficult to crack, but don't be
fooled into thinking this is secure. The 'true' password is just the hashed buffer,
so a marginally able attacker with access to the protocol stream can easily login as you.

Whenever possible one of the secure 3rd party based user authentication mechanisms must be used.
The `OpenAuth` user plugin is required for mmeddle connections between browser and server.

##.

