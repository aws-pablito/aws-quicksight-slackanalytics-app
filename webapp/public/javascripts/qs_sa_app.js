window.onload = (event) => {
    const url = "https://" + window.location.host + "/auth";
    document.getElementById('placeholder').innerHTML= url;
    //document.getElementById('slack_url').href += url + "/auth";
};

