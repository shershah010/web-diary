import sys
import tensorflow as tf
import tensorflow_datasets as tfds

# Load model
encoder = tfds.features.text.SubwordTextEncoder.load_from_file('encoder')
model = tf.keras.models.load_model('word2vec.keras')

# Get test data
content = sys.argv[1]
content = content.lower().replace(r'[.?,!"\']', '').replace('/', ' ')

# Run through model
encoded_data = encoder.encode(content)
prediction = model.predict([encoded_data])

print(int(prediction[0]))
sys.stdout.flush()
