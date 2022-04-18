import type { ParamListBase } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationOptions,
  StackScreenProps,
} from '@react-navigation/stack';

import {
  HeaderBackButton as BackButton
} from '@react-navigation/elements';

import * as React from 'react';
import { AccessibilityInfo, findNodeHandle, Platform, ScrollView, StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-paper';

import Albums from '../Shared/Albums';
import Article from '../Shared/Article';
import NewsFeed from '../Shared/NewsFeed';

export type SimpleStackParams = {
  Article: { author: string } | undefined;
  NewsFeed: { date: number };
  Albums: undefined;
};

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = ({
  navigation,
  route,
}: StackScreenProps<SimpleStackParams, 'Article'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigation.replace('NewsFeed', { date: Date.now() })}
          style={styles.button}
        >
          Replace with feed
        </Button>
        <Button
          mode="outlined"
          onPress={() =>
            navigation.setParams({
              author:
                route.params?.author === 'Gandalf' ? 'Babel fish' : 'Gandalf',
            })
          }
          style={styles.button}
        >
          Update params
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.pop()}
          style={styles.button}
        >
          Pop screen
        </Button>
      </View>
      <Article
        author={{ name: route.params?.author ?? 'Unknown' }}
        scrollEnabled={scrollEnabled}
      />
    </ScrollView>
  );
};

const NewsFeedScreen = ({
  route,
  navigation,
}: StackScreenProps<SimpleStackParams, 'NewsFeed'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Albums')}
          style={styles.button}
        >
          Navigate to album
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Go back
        </Button>
      </View>
      <NewsFeed scrollEnabled={scrollEnabled} date={route.params.date} />
    </ScrollView>
  );
};

const AlbumsScreen = ({
  navigation,
}: StackScreenProps<SimpleStackParams, 'Albums'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigation.push('Article', { author: 'Babel fish' })}
          style={styles.button}
        >
          Push article
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.pop(2)}
          style={styles.button}
        >
          Pop by 2
        </Button>
      </View>
      <Albums scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

const navHeaderStyles = StyleSheet.create({
  navigationHeaderContainer: {
    paddingTop:44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'green',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
});

const SimpleStack = createStackNavigator<SimpleStackParams>();

const Heading3 = React.forwardRef((props, ref) => <Text ref={ref} style={[navHeaderStyles.title]} accessibilityRole="header">{props.children}</Text>);

const Header = React.forwardRef((props, ref) => <View><Heading3 ref={ref}>{props.title}</Heading3></View>);

const NavHeader = React.forwardRef((props, ref) => <View style={[navHeaderStyles.navigationHeaderContainer]}>
<BackButton />
<Header ref={ref} title={props.title}/><Text>         </Text></View>);

export default function SimpleStackScreen({
  navigation,
  screenOptions,
}: StackScreenProps<ParamListBase> & {
  screenOptions?: StackNavigationOptions;
}) {

  const focusRef = React.useRef();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SimpleStack.Navigator screenOptions={screenOptions}>
      <SimpleStack.Screen
        name="Article"
        component={ArticleScreen}
        options={{
          header: ({ navigation, scene, insets }) => (
            <NavHeader ref={focusRef} title="Miniapp Screen Title" />
          ),
        }}
        initialParams={{ author: 'Gandalf' }}
        listeners={{
          transitionEnd: () => {
            if (Platform.OS === 'ios') {
              if (focusRef.current) {
                const focusPoint = findNodeHandle(focusRef.current);
                if (focusPoint) {
                  AccessibilityInfo.setAccessibilityFocus(focusPoint);
                }
             }
           }
          },
        }}
      />
      <SimpleStack.Screen
        name="NewsFeed"
        component={NewsFeedScreen}
        options={{ title: 'Feed' }}
      />
      <SimpleStack.Screen
        name="Albums"
        component={AlbumsScreen}
        options={{ title: 'Albums' }}
      />
    </SimpleStack.Navigator>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  button: {
    margin: 8,
  },
});
