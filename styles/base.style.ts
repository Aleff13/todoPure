import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  flexRow: {
    alignContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderColor: '#4630eb',
    flex: 1,
    height: 48,
    margin: 16,
    padding: 8,
  },
  listArea: {
    backgroundColor: '#f0f0f0',
    flex: 1,
  },
  sectionContainer: {
    borderColor: '#4630eb',

    marginBottom: 16,
    marginHorizontal: 16,
    top: 20,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  sectionHeading: {
    fontSize: 18,
  },
  todo: {
    backgroundColor: '#efa3b1',
    padding: 8,
    margin: 2,
    borderRadius: 5,
  },
  finished: {
    padding: 8,
    margin: 2,
  }
});

export default styles;
