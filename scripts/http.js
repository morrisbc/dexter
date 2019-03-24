class httpRequest {
  constructor() {
    this.xhr = new XMLHttpRequest();
  }

  get(url, callback) {
    this.xhr.open("GET", url, true);
    this.xhr.onload = () => {
      if (this.xhr.status === 200) {
        callback(null, JSON.parse(this.xhr.responseText));
      } else {
        callback(`Error ${this.xhr.status}: Pok&eacute;mon not found!`, null);
      }
    };
    this.xhr.send();
  }

  post() {}

  put() {}

  delete() {}
}
