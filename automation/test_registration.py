from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time
import os

# ================== SETUP ==================
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
driver.maximize_window()

URL = "file:///C:/Users/admin/OneDrive/Desktop/registration%20copy%20copy/index.html"
driver.get(URL)

wait = WebDriverWait(driver, 10)

# Ensure screenshots folder exists
os.makedirs("screenshots", exist_ok=True)

print("Page URL:", driver.current_url)
print("Page Title:", driver.title)

# Ensure page loaded
wait.until(EC.presence_of_element_located((By.ID, "firstName")))

# =========================================================
# FLOW A — NEGATIVE SCENARIO (Last Name Missing)
# =========================================================
print("Running Negative Scenario")

driver.find_element(By.ID, "firstName").send_keys("John")
# lastName intentionally skipped
driver.find_element(By.ID, "email").send_keys("john@gmail.com")
driver.find_element(By.ID, "phone").send_keys("9876543210")
driver.find_element(By.XPATH, "//input[@value='Male']").click()

# Country → State → City (India)
country = Select(wait.until(EC.element_to_be_clickable((By.ID, "country"))))
country.select_by_value("India")

wait.until(lambda d: d.find_element(By.ID, "state").is_enabled())
Select(driver.find_element(By.ID, "state")).select_by_visible_text("Delhi")

wait.until(lambda d: d.find_element(By.ID, "city").is_enabled())
Select(driver.find_element(By.ID, "city")).select_by_visible_text("New Delhi")

driver.find_element(By.ID, "password").send_keys("Test@123")
driver.find_element(By.ID, "confirmPassword").send_keys("Test@123")
driver.find_element(By.ID, "terms").click()

submit_btn = driver.find_element(By.ID, "submitBtn")

# Validate submit button is disabled
assert not submit_btn.is_enabled()
print("Submit button disabled as expected for invalid form")

driver.save_screenshot("screenshots/error-state.png")
print("Negative scenario passed")

# =========================================================
# FLOW B — POSITIVE SCENARIO
# =========================================================
print("Running Positive Scenario")
driver.refresh()

wait.until(EC.presence_of_element_located((By.ID, "firstName")))

driver.find_element(By.ID, "firstName").send_keys("John")
driver.find_element(By.ID, "lastName").send_keys("Doe")
driver.find_element(By.ID, "email").send_keys("john@gmail.com")
driver.find_element(By.ID, "phone").send_keys("9876543210")
driver.find_element(By.XPATH, "//input[@value='Male']").click()

country = Select(wait.until(EC.element_to_be_clickable((By.ID, "country"))))
country.select_by_value("India")

wait.until(lambda d: d.find_element(By.ID, "state").is_enabled())
Select(driver.find_element(By.ID, "state")).select_by_visible_text("Delhi")

wait.until(lambda d: d.find_element(By.ID, "city").is_enabled())
Select(driver.find_element(By.ID, "city")).select_by_visible_text("New Delhi")

driver.find_element(By.ID, "password").send_keys("Test@123")
driver.find_element(By.ID, "confirmPassword").send_keys("Test@123")
driver.find_element(By.ID, "terms").click()

submit_btn = driver.find_element(By.ID, "submitBtn")
assert submit_btn.is_enabled()

submit_btn.click()

# Handle success alert
alert = wait.until(EC.alert_is_present())
alert.accept()

driver.save_screenshot("screenshots/success-state.png")
print("Positive scenario passed")

# =========================================================
# FLOW C — LOGIC VALIDATION
# =========================================================
print("Running Logic Validation")
driver.refresh()

wait.until(EC.presence_of_element_located((By.ID, "country")))

country = Select(wait.until(EC.element_to_be_clickable((By.ID, "country"))))
country.select_by_value("USA")

wait.until(lambda d: d.find_element(By.ID, "state").is_enabled())
Select(driver.find_element(By.ID, "state")).select_by_visible_text("California")

wait.until(lambda d: d.find_element(By.ID, "city").is_enabled())
Select(driver.find_element(By.ID, "city")).select_by_visible_text("Los Angeles")

# Password strength check
driver.find_element(By.ID, "password").send_keys("abc")
strength_text = driver.find_element(By.ID, "strengthText").text
assert "Weak" in strength_text

print("Logic validation passed")

# ================== END ==================
time.sleep(2)
driver.quit()
