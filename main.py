print('hi')

import pyautogui
import keyboard
from PIL import Image, ImageDraw

def create_black_overlay(x, y, width, height):
    # Get the screen's width and height
    screen_width, screen_height = pyautogui.size()

    # Ensure the specified region is within bounds
    if x < 0:
        x = 0
    if y < 0:
        y = 0
    if x + width > screen_width:
        width = screen_width - x
    if y + height > screen_height:
        height = screen_height - y

    # Create a blank image with a black background
    overlay = Image.new('RGB', (width, height), (0, 0, 0))

    # Get the screen capture
    screenshot = pyautogui.screenshot(region=(x, y, width, height))

    # Paste the screenshot onto the black background
    overlay.paste(screenshot, (0, 0))

    # Display the overlay
    overlay.show()

    # Wait for a key press to exit
    keyboard.wait('esc')  # You can change 'esc' to any other key you prefer

if __name__ == "__main__":
    x = int(input("Enter the X coordinate of the top-left corner of the region: "))
    y = int(input("Enter the Y coordinate of the top-left corner of the region: "))
    width = int(input("Enter the width of the region: "))
    height = int(input("Enter the height of the region: "))

    create_black_overlay(x, y, width, height)







