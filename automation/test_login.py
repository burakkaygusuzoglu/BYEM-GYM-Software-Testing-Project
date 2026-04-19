from selenium import webdriver
from selenium.webdriver.common.by import By
import time

driver = webdriver.Chrome()
driver.maximize_window()

try:
    driver.get("http://127.0.0.1:8080/pages/auth/login.html")

    time.sleep(2)

    # Inputs
    email = driver.find_element(By.ID, "email")
    password = driver.find_element(By.ID, "password")

    # Fill form
    email.send_keys("bk@test.com")
    password.send_keys("123456")

    # Click button
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    time.sleep(3)

    print("Login automation executed successfully.")

finally:
    driver.quit()