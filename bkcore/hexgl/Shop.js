var bkcore = bkcore || {};
bkcore.hexgl = bkcore.hexgl || {};

bkcore.hexgl.Shop = function(game) {
    this.game = game;
    this.coins = 500;
    this.purchasedItems = new Set();
    
    // Close button handler
    var closeButton = document.getElementById('close-shop');
    if (closeButton) {
        closeButton.onclick = function() {
            console.log('Close button clicked');
            var shopDialog = document.getElementById('shop-dialog');
            var shopOverlay = document.querySelector('.shop-overlay');
            if (shopDialog && shopOverlay) {
                shopDialog.classList.remove('visible');
                shopOverlay.classList.remove('visible');
            }
        };
    }
    
    // Buy button handlers
    var self = this;
    var buyButtons = document.querySelectorAll('.buy-button');
    buyButtons.forEach(function(button) {
        button.onclick = function() {
            console.log('Buy button clicked');
            var item = button.parentElement;
            var itemId = item.dataset.id;
            var price = parseInt(button.dataset.price);
            
            self.purchaseItem(itemId, price, button);
        };
    });
};

bkcore.hexgl.Shop.prototype.purchaseItem = function(itemId, price, button) {
    if (this.coins >= price && !this.purchasedItems.has(itemId)) {
        this.coins -= price;
        this.purchasedItems.add(itemId);
        
        // Update UI
        document.getElementById('coin-count').textContent = this.coins;
        button.textContent = 'Purchased';
        button.disabled = true;
        
        // Apply item effects
        this.applyItemEffect(itemId);
    }
};

bkcore.hexgl.Shop.prototype.applyItemEffect = function(itemId) {
    var shipControls = this.game.ships.getControlObject();
    
    switch(itemId) {
        case 'boost':
            shipControls.maxSpeed *= 1.1;
            break;
        case 'shield':
            shipControls.shieldEnabled = true;
            break;
        case 'handling':
            shipControls.rollSpeed *= 1.15;
            shipControls.yawSpeed *= 1.15;
            break;
    }
}; 