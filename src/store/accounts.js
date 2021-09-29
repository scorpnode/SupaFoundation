export const accountsModule = {
    namespaced: true,
state : () => ({
    accountDetails: null,
    groupDetails: null,
    newsDetails:null,
    installPreference:0,
  }),

  getters :{
    getAccountDetails(state) {
      return state.accountDetails;
    },
    getGroupDetails(state) {
      return state.groupDetails;
    },
    getNewsDetails(state) {
      return state.newsDetails;
    },

      
    
  },
  actions : {
  
    async initAccountDetails({ commit }) {

        let accountInfo=JSON.parse(localStorage.getItem('accountInfo'))
        let groupInfo=JSON.parse(localStorage.getItem('groupInfo'))
        let newsInfo=JSON.parse(localStorage.getItem('newsInfo'))
      // This will get deprecated soon. Setting it to false removes a warning from the console.

      // if the user is flagged as already connected, automatically connect back to Web3Modal
      if (accountInfo!={} ) {

        commit("setAccountDetails", accountInfo);
        commit("setGroupInfo", groupInfo);
        commit("setNewsDetails", newsInfo);

      }
  
    },
  
  },
  
mutations : {
  
  setAccountDetails(state, accountInfo) {
    state.accountDetails = accountInfo;

  
  },
  setNewsDetails(state, newsInfo) {
    state.newsDetails = newsInfo;

  },
  setGroupInfo(state, groupInfo) {
    state.groupDetails = groupInfo;

  },
  saveNewsDetails(state, newsInfo) {
    state.newsDetails = newsInfo;

    localStorage.setItem('newsInfo',JSON.stringify(newsInfo))
  
  },
  saveInstallPreference(state,installPreference) {
    state.installPreference = installPreference;
  
  },
    saveAccountDetails(state, accountInfo) {
      state.accountDetails = accountInfo;

      localStorage.setItem('accountInfo',JSON.stringify(accountInfo))
    
    },
  
    saveGroupInfo(state, groupInfo) {
      state.groupDetails = groupInfo;
      localStorage.setItem('groupInfo',JSON.stringify(groupInfo))

    },
  
    
}
    
    }
  