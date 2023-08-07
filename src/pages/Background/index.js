console.log('This is the background page.');
console.log('Put the background scripts here.');

fetch("https://manage.deepgram.com/v1/projects_with_scopes", {
      method: "GET",
    })
    .then(async response => {
      const { projects } = await response.json();
      const id = projects[0]["project_id"]
      return id;
    })
    .then((id) => {
      const payload = {
        "comment": "auto generated api chrome extension key",
        "scopes": ["member"],
        "time_to_live_in_seconds": 300,
      };

      return fetch(`https://manage.deepgram.com/v1/projects/${id}/keys`, {
        method: "POST",
        body: JSON.stringify(payload),
      })

    //   return fetch(`https://manage.deepgram.com/v1/projects/${id}/keys`, {
    //     method: "GET"
    //   })
    })
    .then(async (response) => {
      const { apiKeys } = await response.json();
      console.log(apiKeys);
    });