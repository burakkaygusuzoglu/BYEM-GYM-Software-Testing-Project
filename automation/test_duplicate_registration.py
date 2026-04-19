from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

driver = webdriver.Chrome()
driver.maximize_window()

try:
    driver.get("http://127.0.0.1:8080/pages/auth/register.html")

    wait = WebDriverWait(driver, 10)

    # Form gelene kadar bekle
    form = wait.until(EC.presence_of_element_located((By.TAG_NAME, "form")))

    # Form içindeki inputları al
    inputs = form.find_elements(By.TAG_NAME, "input")

    if len(inputs) < 4:
        raise Exception("Expected at least 4 input fields, but found fewer.")

    full_name = inputs[0]
    email = inputs[1]
    password = inputs[2]
    confirm_password = inputs[3]

    # Alanları doldur
    full_name.send_keys("Burak Test")
    email.send_keys("bk@test.com")   # daha önce kayıtlı mail
    password.send_keys("123456")
    confirm_password.send_keys("123456")

    # Submit butonunu bul ve tıkla
    submit_button = form.find_element(By.CSS_SELECTOR, "button[type='submit']")
    submit_button.click()

    time.sleep(3)

    print("Duplicate registration automation executed successfully.")

finally:
    driver.quit()