var params = ['name','email','gender',"O","C","E","A","R"]

var Name = "@{name}";
var Email = "@{email}";

var O = "@{o}";
var C = "@{c}";
var E = "@{e}";
var A = "@{a}";
var R = "@{r}";

console.log("processing paid api")

var Gender = "@{gender}";
if (Gender === 'Male') {
  Gender = "m";
}
else{
  Gender = "f";
}

var values = [Name, Email, Gender, O, C, E, A, R]

var url = "https://levelup.dev.codelinks.hu/generate-pdf?";

console.log("URL IS:" + url)

var i;
for (i=0; i<params.length; i++){
  url = url.concat(params[i], "=", values[i], "&");
}

url = url.concat("auth_token=vA9xB6gD0iY1gD9cQ8tB4zI1sU6zC7aIoC3nS3wK7wY7cO4mW3pW0hX4lM0tQ0aZ"); 
                 //paid auth

console.log(url);

const Http = new XMLHttpRequest();
Http.open("GET", url);
Http.send();

Http.onreadystatechange = (e) => {
   console.log(Http.responseText)
}