``` mermaid
   sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server

    Note right of browser: User send a note via form

    server-->>browser: HTTP 302 (Location: https://studies.cs.helsinki.fi/exampleapp/notes)

    Note left of server: Server confirms the note and sends a redirect request

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes

    Note right of browser: Browser follows the redirect request
    
    server-->>browser: HTML document
    deactivate server

     browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "gghhg", "date": "2025-10-21T12:50:42.154Z"}, ... ]
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes

```