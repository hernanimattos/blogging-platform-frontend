const backendURL = 'http://localhost:8080';

function handleErrors(response) {
    if (!response.ok) {
        return response.json().then((error) => {
            throw new Error(error.message)
        });
    }
    return response;
}

function fetchFromBackend(endpoint) {
    return fetch(backendURL + endpoint, {
        'mode': 'cors',
        'method': 'get',
        'headers': {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(handleErrors)
        .then(response => response.json())
        .catch(error => {
            throw new Error("Unable to fetch from backend due to error: " + error);
        });
}

function fetchPosts() {
    return fetchFromBackend('/post');
}

function fetchPost(id) {
    return fetchFromBackend(`/post/${id}`);
}

function fetchCommentsForPost(postId) {
    return fetchFromBackend(`/comment/post/${postId}`);
}

function fetchAuthors() {
    return fetchFromBackend('/author');
}

function fetchCategories() {
    return fetchFromBackend('/category');
}

function fetchPostsByCategory(id) {
    return fetchFromBackend(`/post/findByCategory?category=${id}`)
}

function fetchPostsByAuthor(id) {
    return fetchFromBackend(`/post/findByAuthor?author=${id}`)
}

function deleteFromBackend(endpoint) {
    return fetch(backendURL + endpoint, {
        'mode': 'cors',
        'method': 'delete',
        'headers': {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(handleErrors)
        .catch(error => {
            throw new Error("Unable to delete from backend due to error: " + error);
        });
}

function deleteAuthor(id) {
    return deleteFromBackend(`/author/${id}`);
}

function deleteCategory(id) {
    return deleteFromBackend(`/category/${id}`);
}

function deletePost(id) {
    return deleteFromBackend(`/post/${id}`);
}

function postToBackend(endpoint, data) {
    return fetch(backendURL + endpoint, {
        'mode': 'cors',
        'method': 'post',
        'body': JSON.stringify(data),
        'headers': {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(handleErrors)
        .then(response => response.json())
        .catch(error => {
            throw new Error("Unable to save to backend due to error: " + error);
        });
}

function savePost(post) {
    return postToBackend('/post', post)
}

function saveComment(comment) {
    return postToBackend(`/comment/post/${comment.postId}`, comment);
}

function putToBackend(endpoint, data) {
    return fetch(backendURL + endpoint, {
        'mode': 'cors',
        'method': 'put',
        'body': JSON.stringify(data),
        'headers': {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
        .catch(error => {
            throw new Error("Unable to put to backend due to error: " + error);
        });
}

function updatePost(post) {
    return putToBackend(`/post/${post.id}`, post);
}

export default {
    fetchAuthors,
    fetchCategories,
    fetchPosts,
    fetchPostsByCategory,
    fetchPostsByAuthor,
    fetchPost,
    fetchCommentsForPost,
    savePost,
    saveComment,
    deleteAuthor,
    deleteCategory,
    deletePost,
    updatePost
};