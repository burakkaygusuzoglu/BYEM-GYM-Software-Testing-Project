from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

driver = webdriver.Chrome()
driver.maximize_window()

try:
    driver.get("http://127.0.0.1:8080/pages/auth/login.html")

    wait = WebDriverWait(driver, 10)

    email = wait.until(EC.presence_of_element_located((By.ID, "email")))
    password = wait.until(EC.presence_of_element_located((By.ID, "password")))
    login_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']")))

    email.send_keys("bk@test.com")
    password.send_keys("wrongpassword")
    login_button.click()

    time.sleep(3)

    print("Invalid login automation executed successfully.")

finally:
    driver.quit()