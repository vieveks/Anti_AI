import pyautogui
import cv2
import requests

# Function to capture the screen
def capture_screen():
    screenshot = pyautogui.screenshot()
    screenshot.save('screenshot.png')
    return cv2.imread('screenshot.png')

# Function to check if a YouTube video is in a specific category
def is_video_in_category(video_url, target_category):
    # Use the YouTube API to get video information
    # You need to replace 'YOUR_API_KEY' with your actual API key
    api_key = 'YOUR_API_KEY'
    video_id = video_url.split('v=')[1]
    api_url = f'https://www.googleapis.com/youtube/v3/videos?id={video_id}&part=snippet&key={api_key}'
    
    response = requests.get(api_url)
    data = response.json()
    
    # Extract video category
    video_category = data['items'][0]['snippet']['categoryId']
    
    # Check if the video category matches the target category
    return video_category == target_category

# Example usage
screen = capture_screen()

# Define the region where the YouTube video is located
# This is a placeholder, you need to find the coordinates based on your screen layout
video_region = screen[100:300, 200:400]

# Check if the video in the specified category
video_url = 'https://www.youtube.com/watch?v=VIDEO_ID'
target_category = '22'  # Example category ID (you need to replace this)
if is_video_in_category(video_url, target_category):
    # Block the screen or take other actions
    pyautogui.draw.rectangle(video_region, fill='black')

# Display the modified screen
cv2.imshow('Blocked Screen', screen)
cv2.waitKey(0)
cv2.destroyAllWindows()