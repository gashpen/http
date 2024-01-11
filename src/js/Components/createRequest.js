export default createRequest;
const createRequest = (options = {}) => {
    let xhr = new XMLHttpRequest();
    let formData = new FormData();
    let url = options.url;
    let method = options.method;
    let data = options.data;

    xhr.responseType = 'json'

    if(method === 'GET') {
        url += '?'
        for(let prop in data) {
            url += `${prop}=${data[prop]}&`
        }
        url.slice(0, -1)
    } else {
        for(let prop in data) {
            formData.append(prop, data[prop]);
        }
    }
    try {
        xhr.open(method, url)
        method === 'GET' ? xhr.send() : xhr.send(formData);
        xhr.addEventListener('load', () => {
            if(xhr.DONE && xhr.status === 200) {
                options.callback(null, xhr.response)
            }
        })
    } catch (error) {
        options.callback(error);
    }
};