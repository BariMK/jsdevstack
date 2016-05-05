export default function mapStateToProps(state) {
  return {
    ...state,
    msg: state.intl.messages.get(state.intl.selectedLanguage)
  };
}