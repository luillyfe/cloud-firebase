# Import JSON

Recently I was struggling to add data from a JSON file to a firestore collection. Although, there are other approaches like using a third party service like
Firefoo or creating a firebase application. I ended up building a Firebase function since it appeared to me the more suitable solution for a single-purpose domain.

## Configuration

#### firebase.json

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "functions": [
    {
      "source": "functions",
      "codebase": "default",
      "ignore": [
        "node_modules",
        ".git",
        "firebase-debug.log",
        "firebase-debug.*.log"
      ],
      "predeploy": ["npm --prefix \"$RESOURCE_DIR\" run lint"]
    }
  ],
  "storage": {
    "rules": "storage.rules"
  }
}
```

#### .firebaserc

```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

#### Deploy to firebase

```sh
firebase deploy --only functions
```
