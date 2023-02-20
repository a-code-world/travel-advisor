var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("x-auth-token", "{{token}}");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("https://cloud.visadb.io/apis/enterprise/v1/embassy?from={{country_code}}&to={{country_code}}&lng={{language_code}}", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

  console.log("yo")