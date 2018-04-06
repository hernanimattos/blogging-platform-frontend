import {call, all, put, takeEvery, fork} from 'redux-saga/effects';
import {router, createHashHistory} from 'redux-saga-router';

import Api from '../api';
import {
    ERROR,
    RELOAD_POSTS,
    RELOAD_AUTHORS,
    RELOAD_CATEGORIES,
    POST_SAVE,
    VIEW_POST,
    APPLICATION_LOADED,
    SAVE_COMMENT,
    COMMENT_ADDED
} from "../actions";

const history = createHashHistory();

const fetchPostsSaga = function* fetchPosts() {
    try {
        const posts = yield call(Api.fetchPosts);
        yield put({type: RELOAD_POSTS, data: {name: 'posts', payload: posts}});
    } catch (e) {
        yield put({type: ERROR, data: e.message});
    }
};
const routes = {
    '/': fetchPostsSaga,
    '/admin': fetchPostsSaga,
    '/view-post/:id': function* viewPostSaga({id}) {
        try {
            const [post, comments] = yield all([
                call(Api.fetchPost, id),
                call(Api.fetchCommentsForPost, id)
            ]);
            yield put({type: VIEW_POST, data: {...post, comments}});
        } catch (e) {
            yield put({type: ERROR, data: e.message});
        }
    }
};

function* fetchMainPageData() {
    try {
        const [categories, authors] = yield all([
            call(Api.fetchCategories),
            call(Api.fetchAuthors),
        ]);
        yield put({type: RELOAD_AUTHORS, data: {name: 'authors', payload: authors}});
        yield put({type: RELOAD_CATEGORIES, data: {name: 'categories', payload: categories}});
    } catch (e) {
        yield put({type: ERROR, data: e.message});
    }
}

function* savePost(action) {
    try {
        yield call(Api.savePost, action.data);
        history.push('/');
    } catch (e) {
        yield put({type: ERROR, data: e.message});
    }
}

function* saveComment(action) {
    try {
        const savedComment = yield call(Api.saveComment, action.data);
        yield put({type: COMMENT_ADDED, data: savedComment});
    } catch (e) {
        yield put({type: ERROR, data: e.message});
    }
}

function* mainSaga() {
    yield takeEvery(POST_SAVE, savePost);
    yield takeEvery(SAVE_COMMENT, saveComment);
    yield takeEvery(APPLICATION_LOADED, fetchMainPageData);
    yield fork(router, history, routes);
}

export default mainSaga;