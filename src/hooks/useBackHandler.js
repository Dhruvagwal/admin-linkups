import { BackHandler } from 'react-native'
export default App = ()=>{
    BackHandler.addEventListener('hardwareBackPress', function() {
        /**
         * this.onMainScreen and this.goBack are just examples,
         * you need to use your own implementation here.
         *
         * Typically you would use the navigator here to go to the last state.
         */
        if (!this.onMainScreen()) {
          this.goBack();
      
          /**
           * When true is returned the event will not be bubbled up
           * & no other back action will execute
           */
          return true;
        }
      
        /**
         * Returning false will let the event to bubble up & let other event listeners
         * or the system's default back action to be executed.
         */
        return false;
      });
}