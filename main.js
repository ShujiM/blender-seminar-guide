document.addEventListener('DOMContentLoaded', () => {
    const navCards = document.querySelectorAll('.nav-card');
    const contentSections = document.querySelectorAll('.content-section');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    // セクション完了状態を管理
    const completedSections = new Set();
    const totalSections = 8;

    function updateProgress() {
        const completed = completedSections.size;
        const percentage = (completed / totalSections) * 100;
        
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${completed}/${totalSections} 完了`;
    }

    function switchTab(targetId) {
        // ナビゲーションカードのアクティブ状態更新
        navCards.forEach(card => {
            if (card.dataset.target === targetId) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        // コンテンツセクションの表示切り替え
        contentSections.forEach(section => {
            if (section.id === targetId) {
                section.classList.add('active');
                // セクションを開いたら完了状態にマーク
                markSectionCompleted(targetId);
            } else {
                section.classList.remove('active');
            }
        });
        
        updateProgress();
    }
    
    function markSectionCompleted(sectionId) {
        completedSections.add(sectionId);
        
        // 対応するナビゲーションカードに完了マークを追加
        navCards.forEach(card => {
            if (card.dataset.target === sectionId) {
                card.classList.add('completed');
            }
        });
    }
    
    // ナビゲーションカードのクリックイベント
    navCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetId = card.dataset.target;
            if (targetId) {
                switchTab(targetId);
                
                // スムーズスクロール
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }
            }
        });
    });

    // グローバル関数として公開（内部リンク用）
    window.switchTab = switchTab;

    // インタラクティブテーブル
    const tableRows = document.querySelectorAll('#format-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', () => {
            tableRows.forEach(r => r.style.backgroundColor = '');
            row.style.backgroundColor = '#e2e8f0';
        });
    });
    
    // 記事内のページ内リンクにもタブ切り替えを適用
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const hash = this.getAttribute('href');
            if (hash && hash.startsWith('#')) {
                const targetId = hash.slice(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection && targetSection.classList.contains('content-section')) {
                    e.preventDefault();
                    switchTab(targetId);
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // 初期状態の設定
    updateProgress();
});