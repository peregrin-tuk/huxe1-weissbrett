/* eslint-disable no-unused-vars */
import Vue from 'vue'
import Vuex, {Store} from 'vuex'
import {firestoreAction, vuexfireMutations} from 'vuexfire'
import {db} from './database'

Vue.use(Vuex)

const defaultCurrentBoard = {
  name: 'loading...',
  key: '',
  content: [],
  id: ''
}

const availableTools = ['select', 'brush', 'eraser', 'form', 'text']

const store: Store<any> = new Vuex.Store({
  state: {
    localStoredBoards: [],
    currentBoard: defaultCurrentBoard,
    activeTool: 'brush', // eg. 'brush' or 'form'
    toolProperties: {
      select: {},
      brush: {
        color: '#000000',
        size: 12
      },
      eraser: {
        size: 12
      },
      form: {
        strokeColor: '#000000',
        fillColor: '#000000',
        formType: 'rectangle'
      },
      text: {
        color: '#000000',
        size: 12
      }
    },
    selectedBoardItem: null
  },

  getters: {
    getBoardName: state => {
      if (!store.state.currentBoard) return
      return store.state.currentBoard.name
    },
    getBoardId: state => {
      if (!store.state.currentBoard) return
      return store.state.currentBoard.id
    }
  },

  mutations: {
    setActiveTool(state, tool) {
      availableTools.find((e) => e === tool) ?
      state.activeTool = tool : console.warn(`denied setting active tool to invalid value '${tool}', available values are${availableTools.map((tool) => ' ' + tool)} `)
    },
    resetCurrentBoardToDefaults(state) {
      state.currentBoard = defaultCurrentBoard
    },
    ...vuexfireMutations
  },

  actions: {
    bindCurrentBoard: firestoreAction(({bindFirestoreRef}, payload) => {
      // db.collection('boards').doc(payload).get().then( (doc) => console.log(doc.data()))
      return bindFirestoreRef('currentBoard',
        db.collection('boards').doc(payload), {reset: true})
        .then((e) => new Promise((resolve, reject) => {
          e ? resolve() : reject()
        }).catch((e) => {
          console.warn('Could not bind board because the board with the id ' + payload + ' could not be retrieved.')
          //store.commit('resetCurrentBoardToDefaults')
        }))
    }),

    updateBoardName: firestoreAction(({state}, payload) => {
      return db.collection('boards')
        .doc(location.hash.substr(1))
        .update({name: payload})
        .then(e => {
          console.log('successfully updated board name to  ', payload)
        })
        .catch(e => {
          console.error(e)
        })
    }),

    addNewBoard: firestoreAction(({bindFirestoreRef}) => {
      const ref = db.collection('boards').doc()
      return ref.set({
        name: 'New board',
        content: [],
        key: 'placeholder'
      }).then(e => {
        // db.collection('boards').doc(ref.id).get().then( (doc) => console.log(doc.data()))
        store.dispatch("bindCurrentBoard", ref.id)
      })
    })
  }
});

export default store
