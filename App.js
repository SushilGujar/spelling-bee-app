import React, {useState} from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import Wordlist from './words.json';
import { Audio } from 'expo-av';
import { FlatList } from 'react-native-gesture-handler';

export default function App() {
  const [sound, setSound] = useState();
  const [words, setWords] = useState(Wordlist.words)
  const [selectedWord, setSelectedWord] = useState();
  const [isShow, setIsShow] = useState(false);
  const [search, setSearch] = useState('');

  const playSound = async (item) => {
    //console.debug('Loading Sound ');
    setSelectedWord(item.word);
    const { sound } = await Audio.Sound.createAsync(
       {uri: item.url}
    );
    setSound(sound);

    //console.debug('Playing Sound');
    try {
      await sound.playAsync();
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    return sound
      ? () => {
          //console.log('Unloading Sound');
          sound.unloadAsync(); }
      : undefined;
  }, [sound]);

  const show = (e) => {
    setIsShow(true);
  }

  const hide = (e) => {
    setIsShow(false);
  }

  const handleSearch = (search) => {
    setSearch(search);
    if(search.length < 1){
      setWords(Wordlist.words);
    }
    const result = Wordlist.words.filter(({word, url}) => word.toLowerCase().indexOf(search.toLowerCase()) > -1);
    setWords(result);
  }

  const Item = ({ item }) => (
    <TouchableOpacity onPress={() => playSound(item)} onLongPress={show} >
      <Text style={(selectedWord==item.word && isShow)? styles.show : styles.play} >{item.word}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => <Item item={item} />;

  return (
    <SafeAreaView style={styles.container}>
      <TextInput placeholder="Type Here..."
          onChangeText={handleSearch}
          style={styles.searchbar}
          value={search}/>
      <FlatList
        data={words}
        renderItem={renderItem}
        keyExtractor={(item) => item.word}
        extraData={selectedWord}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#111'
  },

  searchbar: {
    margin: 10,
    marginTop: 20,
    width: '90%',
    height: 28,
    padding: 2,
    fontSize: 20,
    backgroundColor: '#222',
    color: '#ccc'
  },

  play: {
    display: 'flex',
    padding: 5,
    margin: 2,
    width: 300,
    fontSize: 28,
    backgroundColor: '#333',
    textAlign: 'center',
    borderRadius: 10,
    color: '#ccc'
  },

  show: {
    display: 'flex',
    padding: 5,
    margin: 2,
    width: 300,
    fontSize: 28,
    backgroundColor: '#333',
    textAlign: 'center',
    borderRadius: 10,
    color: '#ccc'
  }
});
