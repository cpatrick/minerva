from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream

# Go to http://dev.twitter.com and create an app.
# The consumer key and secret will be generated for you after
CONSUMER_KEY = ""
CONSUMER_SECRET = ""

# After the step above, you will be redirected to your app's page.
# Create an access token under the the "Your access token" section
ACCESS_KEY = ""
ACCESS_SECRET = ""

class StdOutListener(StreamListener):
    """ A listener handles tweets are the received from the stream.
    This is a basic listener that just prints received tweets to stdout.

    """
    def on_data(self, data):
        import json
        json_data = json.loads(data)
        print json_data['geo']
        return True

    def on_error(self, status):
        print status

if __name__ == '__main__':
    l = StdOutListener()
    auth = OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
    auth.set_access_token(ACCESS_KEY, ACCESS_SECRET)

    stream = Stream(auth, l)
    stream.filter(track=['ebola'])